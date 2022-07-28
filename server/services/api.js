import path from "path";
import multer from "multer";
import AWS from "aws-sdk";
import { mkdir } from "fs/promises";
import { Router, json } from "express";
import { getJobStatus, runMagmaAnalysis } from "./analysis.js";
import { withAsync } from "./middleware.js";
import { EcsWorker, LocalWorker } from "./queue-worker.js";
import { magma } from "./analysis.js";

const { INPUT_FOLDER, OUTPUT_FOLDER, DATA_BUCKET, QUEUE_NAME, WORKER_TYPE, BASE_URL } = process.env;
import { createSqliteTableFromFile, getSqliteConnection } from "./database.js";

export const apiRouter = Router();

/**
 * Reads a template, substituting {tokens} with data values
 * @param {string} filepath
 * @param {object} data
 */
async function readTemplate(filePath, data) {
  const template = await fs.promises.readFile(path.resolve(filePath));

  // replace {tokens} with data values or removes them if not found
  return String(template).replace(/{[^{}]+}/g, (key) => data[key.replace(/[{}]+/g, "")] || "");
}

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const { logger } = req.app.locals;
    const { request_id } = req.body;
    const uploadDir = path.resolve(INPUT_FOLDER, request_id);
    logger.debug(`Ensure folder exists: ${uploadDir}`);
    await mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const { logger } = req.app.locals;
    logger.info(req.body.request_id);

    logger.debug(`Original filename: ${file.originalname}`);
    if (
      file.fieldname === "geneAnalysisBim" ||
      file.fieldname === "geneAnalysisBed" ||
      file.fieldname === "geneAnalysisFam"
    ) {
      logger.debug(`New Filename ${req.body.request_id.concat(path.extname(file.originalname))}`);
      cb(null, req.body.request_id.concat(path.extname(file.originalname)));
    } else cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

apiRouter.use(json());

apiRouter.get("/ping",
  withAsync(async (request, response) => {
    const results = await magma(['--version'])
    response.json(results);
  })
);

apiRouter.post(
  "/submit",
  withAsync(async (req, res) => {
    const { logger } = req.app.locals;
    const { request_id } = req.body;
    logger.info(`[${request_id}] Execute /submit`);
    const sqs = new AWS.SQS();
    let body = Object.assign(req.body, {
      timestamp: new Date().toLocaleString(),
    });

    logger.info(body);

    if (body.queue) {
      const worker = {
        local: new LocalWorker({ runMagmaAnalysis }),
        ecs: new EcsWorker({ runMagmaAnalysis }),
      }[WORKER_TYPE];

      const start = new Date().getTime();
      worker.dispatch("runMagmaAnalysis", { body: body, logger: logger });
      const end = new Date().getTime();

      const time = end - start;
      const minutes = Math.floor(time / 60000);
      var seconds = ((time % 60000) / 1000).toFixed(0);

      var runtime = (minutes > 0 ? minutes + " min " : "") + seconds + " secs";

      const templateData = {
        jobName: body.jobName,
        originalTimestamp: body.timestamp,
        runTime: runtime,
        resultsUrl: `${BASE_URL}/#/${request_id}`,
      };
    } else await runMagmaAnalysis(body, logger);

    logger.info(`[${request_id}] Finish /submit`);
    res.json("Finished Magma");
  })
);

apiRouter.post(
  "/file-upload",
  upload.any(),
  withAsync(async (req, res) => {
    const { logger } = req.app.locals;
    logger.info(`[${req.body.request_id}] Execute /file-upload`);
    logger.debug(`[${req.body.request_id}] Parameters ${JSON.stringify(req.body, undefined, 4)}`);
    logger.info(`[${req.body.request_id}] Finished /file-upload`);
    res.json({
      files: req.files,
      body: req.body,
    });
  })
);

apiRouter.get(
  "/job-status/:id",
  withAsync(async (req, res) => {
    const { id } = req.params;
    const status = await getJobStatus(id);
    res.json(status);
  })
);

apiRouter.post(
  "/query-results",
  withAsync(async (req, res) => {
    const { request_id, table, columns, conditions, orderBy, offset, limit } = req.body;
    const databasePath = path.resolve(OUTPUT_FOLDER, request_id, "results.db");
    // ensure database file exists (eg: downloaded from s3 bucket) before proceeding
    // ensureLocalFileExists(s3ResultsPath, databasePath); // TODO: implement
    const { logger } = req.app.locals;
    logger.info(`[${req.body.request_id}] Execute /query-results`);
    const connection = getSqliteConnection(databasePath);
  
    var results = await connection
      .select(columns || "*")
      .from(table)
      .offset(offset || 0)
      .limit(limit || 100000);

    results = results.map((e) => {
      const values = Object.values(e)[0].replace(/'/g,"").split(/\s+/)
      return({
        gene: values[0],
        chr: values[1],
        start: values[2],
        stop: values[3],
        nspns: values[4],
        nparam: values[5],
        n: values[6],
        zstat: values[7],
        p: values[8]
      })
    })
    logger.info(`[${req.body.request_id}] Finish /query-results`);
    res.json(results);
  })
  
);

apiRouter.post(
  "/fetch-results",
  withAsync(async (request, response) => {
    const { logger } = request.app.locals;
    logger.info(request.body);

    if (!request.submitted) {
      logger.info(`Execute /fetch-results sample file`);
      const s3 = new AWS.S3();
      const filestream = await s3
        .getObject({
          Bucket: DATA_BUCKET,
          Key: `gwastarget/gene_analysis.genes.out`,
        })
        .createReadStream();

      filestream.pipe(response);
      logger.info(`Finish /fetch-results sample file`);
    } else {
      const { request_id } = request.body;
      logger.info(`[${request_id}] Execute /fetch-results`);
      const resultsFolder = path.resolve(OUTPUT_FOLDER, request_id);
      response.download(path.resolve(resultsFolder, "gene_analysis.genes.out"));
      logger.info(`[${request_id}] Finish /fetch-results`);
    }
  })
);
