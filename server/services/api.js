import { mkdir } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { Router, json } from "express";
import multer from "multer";
import { runMagma } from "./analysis.js";
import { withAsync } from "./middleware.js";
const { INPUT_FOLDER, OUTPUT_FOLDER } = process.env;

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
    if(file.fieldname === 'geneAnalysisBim' || file.fieldname === 'geneAnalysisBed' || file.fieldname === 'geneAnalysisFam'){
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
  withAsync(async (request, response) => {
    const { logger } = request.app.locals;
    logger.info(`[${request.body.request_id}] Execute /submit`);

    // generate unique id for response
    const id = randomBytes(16).toString("hex");

    // assign id to body
    let body = Object.assign(request.body, {
      id,
      timestamp: new Date().toLocaleString(),
    });

    logger.info(request.body);
    await runMagma(body, logger);
    logger.info(`[${request.body.request_id}] Finish /submit`);
    response.json("Finished Magma");
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
    const { request_id } = request.body;
    const { logger } = request.app.locals;
    logger.info(request.body);
    logger.info(`[${request_id}] Execute /fetch-results`);

    const resultsFolder = path.resolve(OUTPUT_FOLDER, request_id);
    response.download(path.resolve(resultsFolder, "gene_analysis.genes.out"));
    logger.info(`[${request_id}] Finish /fetch-results`);
  })
);
