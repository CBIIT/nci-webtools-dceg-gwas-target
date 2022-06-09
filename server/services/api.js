const { Router, json } = require("express");
const AWS = require('aws-sdk');
const crypto = require('crypto');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const config = require('../config');
const analysis = require('./analysis');

const apiRouter = Router();

const inputDir = path.resolve(config.efs.input_folder);

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    const { request_id } = req.body;

    const uploadDir = path.resolve(inputDir, request_id);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const { logger } = req.app.locals
    logger.debug(file)
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

apiRouter.use(json());

apiRouter.get("/ping", (request, response) => {
  response.json(true)
});

apiRouter.post("/submit", async (request, response) => {
  const { logger } = request.app.locals
  logger.info(`[${request.body.request_id}] Execute /submit`);
  try {
    const s3 = new AWS.S3();
    const sqs = new AWS.SQS();

    // generate unique id for response
    const id = crypto.randomBytes(16).toString('hex');

    // assign id to body
    let body = Object.assign(request.body, {
      id,
      timestamp: new Date().toLocaleString(),
    });

    logger.info(request.body)
    analysis.runMagma(request)
    return res
  } catch (error) {
    const errorText = String(error.stderr || error);
    response.status(500).json(errorText);
  }
});

apiRouter.post('/file-upload', upload.any(), async (req, res) => {
  const { logger } = req.app.locals
  logger.info(`[${req.body.request_id}] Execute /file-upload`);
  logger.debug(
    `[${req.body.request_id}] Parameters ${JSON.stringify(
      req.body,
      undefined,
      4
    )}`
  );
  try {
    logger.info(`[${req.body.request_id}] Finished /file-upload`);
    res.json({
      files: req.files,
      body: req.body,
    });
  } catch (err) {
    logger.error(`[${req.body.request_id}] Error /file-upload ${err}`);
    res.status(500).json(err);
  }
});

module.exports = { apiRouter };
