import os from "os";
import path from "path";
import { stat } from "fs/promises";
import { readdir, unlinkSync } from "fs";
import { cpus } from "os";
import { setTimeout } from "timers/promises";
import mapValues from "lodash/mapValues.js";
import validator from "validator";
import { sendNotification } from "./notifications.js";
import { execAsync, execFileAsync, readJson, writeJson, mkdirs, coalesceFilePaths, copyFiles, stripExtension } from "./utils.js";
import { createDatabaseFromFiles } from "./database.js";
import { formatObject } from "./logger.js";

export async function runMagma(params, logger, env = process.env) {
  logger.info(".bed Filter: " + params.bedFileFilter)
  const id = params.id;
  const paths = await getPaths(params, env);
  const submittedTime = new Date();
  logger.info(paths);

  try {
    if (!id) throw new Error("Missing id");
    if (!validator.isUUID(id)) throw new Error("Invalid id");
    
    await mkdirs([paths.inputFolder, paths.outputFolder]);
    await writeJson(paths.paramsFile, params);
    await writeJson(paths.statusFile, { id, status: "IN_PROGRESS" });
    await writeJson(
      paths.manifestFile,
      mapValues(paths, (value) => path.parse(value).base)
    );

    // run annotation
    logger.info(`[${id}] Run annotation`);
    const annotationParams = getAnnotationParams(paths);

    logger.info(annotationParams);
    const annotationResults = await runAnnotation(annotationParams, params.magmaType);

    // run gene analysis
    logger.info(`[${id}] Run gene analysis`);
    const geneAnalysisParams = getGeneAnalysisParams(paths, params);

    logger.info(geneAnalysisParams);
    const geneAnalysisResults = await runGeneAnalysis(id, geneAnalysisParams, params.magmaType, env, logger);

    // run gene set analysis
    let geneSetAnalysisResults = null;
    if (!geneAnalysisParams.genesOnly) {
      logger.info(`[${id}] Run gene set analysis`);
      const geneSetAnalysisParams = getGeneSetAnalysisParams(paths);

      logger.info(geneSetAnalysisParams);
      geneSetAnalysisResults = await runGeneSetAnalysis(geneSetAnalysisParams, params.magmaType);
    }

    // export tables to .db file
    logger.info(`[${id}] Create .db file`);
    const tables = [
      { name: "gene_analysis", file: paths.geneAnalysisFile },
      { name: "gene_set_analysis", file: paths.geneSetAnalysisFile },
    ];
    createDatabaseFromFiles(tables, paths.databaseFile);

    // write success status
    const status = { id, status: "COMPLETED" };
    await writeJson(paths.statusFile, status);
    
    // send success notification if email was provided
    if (params.email) {

      //delete input files
      readdir(paths.inputFolder, (err, files) => {
        if (err) {
          console.log(err);
        }
  
        files.forEach((file) => {
          const fileDir = path.join(paths.inputFolder, file);
  
          if (file !== 'params.json') {
            unlinkSync(fileDir);
          }
        });
      });

      
      await sendNotification(
        params.email,
        `Analysis Complete - ${params.jobName}`,
        "templates/user-success-email.html",
        {
          jobName: params.jobName,
          submittedAt: submittedTime.toISOString(),
          executionTime: (new Date().getTime() - submittedTime.getTime()) / 1000,
          resultsUrl: `${env.APP_BASE_URL}/analysis/${id}`,
        }
      );
    }

    return {
      annotation: annotationResults,
      geneAnalysis: geneAnalysisResults,
      geneSetAnalysis: geneSetAnalysisResults,
    };
  } catch (error) {
    // send error notification if email was provided
    console.log(error);
    logger.error(error);
    const status = { id, status: "FAILED", error: { ...error } };
    await writeJson(paths.statusFile, status);
    //delete input files
    readdir(paths.inputFolder, (err, files) => {
      if (err) {
        console.log(err);
      }

      files.forEach((file) => {
        const fileDir = path.join(paths.inputFolder, file);

        if (file !== 'params.json') {
          unlinkSync(fileDir);
        }
      });
    });


    if (params.email) {
      await sendNotification(params.email, `Analysis Failed - ${params.jobName}`, "templates/user-failure-email.html", {
        jobName: params.jobName,
        submittedAt: submittedTime.toISOString(),
        executionTime: (new Date().getTime() - submittedTime.getTime()) / 1000,
        error: formatObject(error),
      });
    }

    return false;
  }
}

export async function magma(args, type = "standard", cwd = process.cwd()) {
  const platform = os.platform();
  const ext = platform === "win32" ? ".exe" : "";
  const exec = "magma" + ext;
  const execPath = path.join("bin", platform, exec);
  try {
    await stat(path.resolve(execPath));
  } catch (e) {
    throw new Error(`Unsupported platform: ${platform}`);
  }
  return await execFileAsync(execPath, args.flat().filter(Boolean), { cwd, windowsHide: true });
}

export async function checkStatus(type = "standard") {
  const { stdout, stderr } = await magma(["--version"], type);
  return stdout || stderr;
}

export function getAnnotationParams(paths) {
  return {
    snpLocFile: paths.snpLocFile,
    geneLocFile: paths.geneLocFile,
    outFile: paths.geneAnnotFilePrefix,
  };
}

export async function runAnnotation({ snpLocFile, geneLocFile, outFile }, type = "standard") {
  return await magma(["--annotate", "--snp-loc", snpLocFile, "--gene-loc", geneLocFile, "--out", outFile], type);
}

export function getGeneAnalysisParams(paths, params) {
  const runGeneSetAnalysis = Boolean(params.geneSetFile || params.covarFile);

  let geneAnalysisParams = {
    bFile: paths.bFile,
    geneAnnotFile: paths.geneAnnotFile,
    bedFileFilter: paths.bedFileFilter,
    genesOnly: !runGeneSetAnalysis,
    outFile: paths.geneAnalyisFilePrefix,
  };

  // add snp file parameters if specified
  if (params.snpPValuesFile) {
    const sampleSizeKey = {
      constant: "N",
      fileColumn: "ncol",
    }[params.sampleSizeType];

    const sampleSize = {
      constant: +params.sampleSize,
      fileColumn: params.sampleSizeColumn,
    }[params.sampleSizeType];

    geneAnalysisParams.pvalFile = paths.pValFile;
    geneAnalysisParams.sampleSize = `${sampleSizeKey}=${sampleSize}`;
  }

  return geneAnalysisParams;
}

export async function runGeneAnalysis(
  id,
  { bFile, pvalFile, bedFileFilter, sampleSize, geneAnnotFile, genesOnly, outFile },
  type = "standard",
  env = process.env,
  logger
) {

  // execute filter if bed file is provided
  if (bedFileFilter) {
    pvalFile = await filterPvalFile(id, pvalFile, bedFileFilter, env, logger);
  }

  // win32 does not support batch mode's --merge option
  if (os.platform() !== "win32") {
    // assume each process requires 2GB of memory
    const maxProcesses = Math.floor(Math.min(cpus().length, os.freemem() / 1024 ** 3 / 2));
    const batchResults = await Promise.all(
      new Array(maxProcesses)
        .fill(0)
        .map((_, index) =>
          magma(
            [
              ["--batch", index + 1, maxProcesses],
              ["--bfile", bFile],
              pvalFile && sampleSize && ["--pval", pvalFile, sampleSize],
              ["--gene-annot", geneAnnotFile],
              genesOnly && "--genes-only",
              ["--out", outFile],
            ],
            type
          )
        )
    );

    const results = await magma(
      [
        ["--merge", outFile],
        ["--out", outFile],
      ],
      type
    );

    return { batchResults, results };
  } else {
    const results = await magma(
      [
        ["--bfile", bFile],
        pvalFile && sampleSize && ["--pval", pvalFile, sampleSize],
        ["--gene-annot", geneAnnotFile],
        genesOnly && "--genes-only",
        ["--out", outFile],
      ],
      type
    );
    return { results };
  }
}

export function getGeneSetAnalysisParams(paths) {
  return {
    geneAnalysisRawFile: paths.geneAnalysisRawFile,
    setFile: paths.setFile,
    covarFile: paths.covarFile,
    outFile: paths.geneSetAnalysisFilePrefix,
  };
}

export async function runGeneSetAnalysis({ geneAnalysisRawFile, setFile, covarFile, outFile }, type = "standard") {
  return await magma(
    [
      ["--gene-results", geneAnalysisRawFile],
      setFile && ["--set-annot", setFile],
      covarFile && ["--gene-covar", covarFile],
      ["--out", outFile],
    ],
    type
  );
}

/**
 * Returns a list of all file paths for a set of parameters
 * @param {any} params
 * @param {any} env
 * @returns {any} paths
 */
export async function getPaths(params, env = process.env) {
  const { id, previousId } = params;
  const defaultInputFolder = path.resolve(env.INPUT_FOLDER, "default");
  const inputFolder = path.resolve(env.INPUT_FOLDER, id);
  const outputFolder = path.resolve(env.OUTPUT_FOLDER, id);
  const paramsFile = path.resolve(inputFolder, "params.json");
  const statusFile = path.resolve(outputFolder, "status.json");
  const manifestFile = path.resolve(outputFolder, "manifest.json");

  // copy files from previous job if specified
  if (previousId && validator.isUUID(previousId)) {
    const previousInputFolder = path.resolve(env.INPUT_FOLDER, previousId);
    copyFiles(previousInputFolder, inputFolder, false);
  }

  // snpLocFile should be a bim file containing snp locations
  const snpLocFile =
    params.snpPopulation === "other"
      ? path.resolve(
        inputFolder,
        params.referenceDataFiles.find((f) => f.toLowerCase().endsWith(".bim"))
      )
      : path.resolve(defaultInputFolder, params.snpPopulation, params.snpPopulation + ".bim");

  // geneLocFile should be a text file containing gene locations
  const geneLocFile = coalesceFilePaths([
    path.resolve(inputFolder, params.geneLocationFile),
    path.resolve(defaultInputFolder, params.geneLocationFile),
  ]);

  const geneAnnotFilePrefix = path.resolve(outputFolder, "annotation");
  const geneAnnotFile = path.resolve(outputFolder, "annotation.genes.annot");

  // bFile should be a PLINK fileset containing genotype data
  const bFile =
    params.genotypeDataSource === "referenceData"
      ? stripExtension(snpLocFile)
      : stripExtension(path.resolve(inputFolder, params.rawGenotypeDataFiles[0]));

  // pValFile should be a text file containing SNP p-values
  const pValFile = coalesceFilePaths([
    path.resolve(inputFolder, params.snpPValuesFile),
    path.resolve(defaultInputFolder, params.snpPValuesFile),
  ]);

  // bedFileFilter should be a .bed file containing SNPs to filter by
  const bedFileFilter = params.bedFileFilter ? coalesceFilePaths([
    path.resolve(inputFolder, params.bedFileFilter),
    path.resolve(defaultInputFolder, 'filters', params.bedFileFilter),
  ]) : null;

  const geneAnalyisFilePrefix = path.resolve(outputFolder, "gene_analysis");
  const geneAnalysisFile = path.resolve(outputFolder, "gene_analysis.genes.out");
  const geneAnalysisRawFile = path.resolve(outputFolder, "gene_analysis.genes.raw");

  const geneSetAnalysisFilePrefix = path.resolve(outputFolder, "gene_set_analysis");
  const geneSetAnalysisFile = path.resolve(outputFolder, "gene_set_analysis.gsa.out");

  const databaseFile = path.resolve(outputFolder, "results.db");

  return {
    inputFolder,
    outputFolder,
    paramsFile,
    statusFile,
    manifestFile,
    snpLocFile,
    geneLocFile,
    geneAnnotFilePrefix,
    geneAnnotFile,
    bFile,
    pValFile,
    bedFileFilter,
    geneAnalyisFilePrefix,
    geneAnalysisFile,
    geneAnalysisRawFile,
    geneSetAnalysisFilePrefix,
    geneSetAnalysisFile,
    databaseFile,
  };
}

/**
 * Filters a pvalue file by a bed file
 * @param {string} pvalFile - path to pvalue file
 * @param {string} bedFileFilter - path to bed file
 * @returns {string} path to filtered pvalue file
 */
export async function filterPvalFile(id, pvalFile, bedFileFilter, env = process.env, logger) {
  const execPath =  path.join("bin", "run.dhs.filter.on.magma.file.sh");
  const filterFile = path.resolve(env.INPUT_FOLDER, "filters", bedFileFilter)
  const inputPath = path.resolve(env.INPUT_FOLDER, id);

  const args = [
    pvalFile,
    filterFile
  ]

  logger.info(execPath + " " + pvalFile + " " + filterFile + " " + inputPath)
  await execAsync("sh " + execPath + " " + pvalFile + " " + filterFile + " " + inputPath)
  return path.resolve(inputPath, "filtered.for.magma.tsv");
}

export async function waitUntilComplete(id, env = process.env, checkInterval = 1000) {
  const start = Date.now();
  const statusFilePath = path.resolve(env.OUTPUT_FOLDER, id, "status.json");
  const isComplete = ({ status }) => ["COMPLETED", "FAILED"].includes(status);
  let statusFile = await readJson(statusFilePath);

  if (!statusFile) {
    throw new Error("No status file found");
  }

  while (!isComplete(statusFile)) {
    statusFile = await readJson(statusFilePath);
    await setTimeout(checkInterval);
  }

  return Date.now() - start;
}
