import path from "path";
import multer from "multer";
import AWS from "aws-sdk";
import { mkdir } from "fs/promises";
import { Router, json } from "express";
import { runMagmaAnalysis } from "./analysis.js";
import { withAsync } from "./middleware.js";

const { INPUT_FOLDER, OUTPUT_FOLDER, DATA_BUCKET, QUEUE_NAME } = process.env;
import { createSqliteTableFromFile, getSqliteConnection } from "./database.js";


export const apiRouter = Router();

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

apiRouter.get("/ping", (request, response) => {
  response.json(true);
});

apiRouter.post(
  "/submit",
  withAsync(async (req, res) => {
    const { logger } = req.app.locals;
    const { request_id } = req.body
    logger.info(`[${request_id}] Execute /submit`);
    const sqs = new AWS.SQS();
    let body = Object.assign(req.body, {
      timestamp: new Date().toLocaleString(),
    });

    logger.info(body);
    
    if (body.queue) {

    }
    else
      await runMagmaAnalysis(body, logger);

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

apiRouter.post(
  "/query-results",
  withAsync(async (req, res) => {
    const { request_id, table, columns, conditions, orderBy, offset, limit } = request.body;
    const databasePath = path.resolve(OUTPUT_FOLDER, request_id, "results.db");
    // ensure database file exists (eg: downloaded from s3 bucket) before proceeding
    // ensureLocalFileExists(s3ResultsPath, databasePath); // TODO: implement
    const connection = getSqliteConnection(databasePath);
    const results = await connection
      .select(columns || "*")
      .from(table)
      .where(conditions)
      .orderBy(orderBy)
      .offset(offset || 0)
      .limit(limit || 100000);
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
    }
    else {
      const { request_id } = request.body;
      logger.info(`[${request_id}] Execute /fetch-results`);
      const resultsFolder = path.resolve(OUTPUT_FOLDER, request_id);
      response.download(path.resolve(resultsFolder, "gene_analysis.genes.out"));
      logger.info(`[${request_id}] Finish /fetch-results`);
    }
  })
);
