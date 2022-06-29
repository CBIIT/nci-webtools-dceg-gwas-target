import fs from "fs";
import os from "os";
import path from "path";
import AWS from "aws-sdk";
import { promisify } from "util";
import { execFile } from "child_process";
const { INPUT_FOLDER, OUTPUT_FOLDER, MAGMA, DATA_BUCKET } = process.env;
const execFileAsync = promisify(execFile);

export async function runMagma(params, logger) {
  logger.info(`[${params.request_id}] Run annotation`);
  const platform = os.platform();
  const s3 = new AWS.S3();
  logger.debug(params)
  const exec = {
    win32: path.resolve(MAGMA, "magma_win.exe"),
    linux: "magma",
    darwin: "magma_mac",
  }[platform];

  const inputDir = path.resolve(INPUT_FOLDER, params.request_id);
  const resultDir = path.resolve(OUTPUT_FOLDER, params.request_id);

  if (!fs.existsSync(resultDir)) {
    fs.mkdirSync(resultDir);
  }
  
  if (!fs.existsSync(inputDir)) {
    fs.mkdirSync(inputDir);
  }
  if (params.snpType.value !== 'custom') {

    const filepath = path.resolve(inputDir, `${params.snpLocFile}`)
    logger.info(filepath)

    //Donwload results if they do no exist
    if (!fs.existsSync(filepath)) {
        
        logger.info(`[${params.request_id}] Download SNP Loc file`);
        const object = await s3.getObject({
            Bucket: DATA_BUCKET,
            Key: `gwastarget/${params.snpType.value}/${params.snpLocFile}`
        }).promise();

        await fs.promises.writeFile(
            filepath,
            object.Body
        )
        logger.info(`[${params.request_id}] Finished downloading SNP Loc file`);
    }
}
  var args = [
    "--annotate",
    "--snp-loc",
    path.resolve(inputDir, params.snpLocFile),
    "--gene-loc",
    path.resolve(inputDir, params.geneLocFile),
    "--out",
    path.resolve(resultDir, "annotation"),
  ];

  logger.info(args);

  await execFileAsync(exec, args);

  logger.info(`[${params.request_id}] Finished /annotation`);
  let geneAnalysis;

  if (params.analysisInput.value === "rawData") {
    geneAnalysis = [
      "--bfile",
      path.resolve(inputDir, params.geneAnalysisFile),
      "--gene-annot",
      path.resolve(resultDir, "annotation.genes.annot"),
      "--out",
      path.resolve(resultDir, "gene_analysis"),
    ];
  } else {
    var sampleSizeParam;
    if (params.sampleSizeOption.value === "input") sampleSizeParam = "N=";
    else sampleSizeParam = "ncol=";
    geneAnalysis = [
      "--bfile",
      path.resolve(inputDir, path.parse(params.geneAnalysisFile).name),
      "--pval",
      path.resolve(inputDir, params.pvalFile),
      `${sampleSizeParam}${params.sampleSize}`,
      "--gene-annot",
      path.resolve(resultDir, "annotation.genes.annot"),
      "--out",
      path.resolve(resultDir, "gene_analysis"),
    ];
  }

  logger.info(geneAnalysis);

  logger.info(`[${params.request_id}] Run gene analsyis`);
  await execFileAsync(exec, geneAnalysis);
  logger.info(`[${params.request_id}] Finish gene analsyis`);
}
