import path from "path";
import multer from "multer";
import AWS from "aws-sdk";
import { mkdir } from "fs/promises";
import { Router, json } from "express";
import { runMagma } from "./analysis.js";
import { withAsync } from "./middleware.js";

const { INPUT_FOLDER, OUTPUT_FOLDER, DATA_BUCKET, QUEUE_NAME } = process.env;


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
    logger.info(req.body.request_id)

    logger.debug(`Original filename: ${file.originalname}`);
    if (file.fieldname === 'geneAnalysisBim' || file.fieldname === 'geneAnalysisBed' || file.fieldname === 'geneAnalysisFam') {
      logger.debug(`New Filename ${req.body.request_id.concat(path.extname(file.originalname))}`)
      cb(null, req.body.request_id.concat(path.extname(file.originalname)))
    }
    else
      cb(null, file.originalname);
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

      const { QueueUrl } = await sqs.getQueueUrl({
        QueueName: QUEUE_NAME
      }).promise();

      const key = path.resolve(INPUT_FOLDER, request_id, 'params.json')

      if (!fs.existsSync(key)) {
        fs.mkdirSync(key);
      }

      fs.writeFileSync(key, JSON.stringify(body))

      // enqueue message and send a response with the request id
      await new AWS.SQS().sendMessage({
        QueueUrl: QueueUrl,
        MessageDeduplicationId: request_id,
        MessageGroupId: request_id,
        MessageBody: JSON.stringify(key)
      }).promise();
    }
    else
      await runMagma(body, logger);

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
  "/fetch-results",
  withAsync(async (request, response) => {

    const { logger } = request.app.locals;
    logger.info(request.body);

    if (!request.submitted) {
      logger.info(`Execute /fetch-results sample file`);
      const s3 = new AWS.S3();
      const filestream = await s3.getObject({
        Bucket: DATA_BUCKET,
        Key: `gwastarget/gene_analysis.genes.out`
      }).createReadStream();

      filestream.pipe(response)
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
