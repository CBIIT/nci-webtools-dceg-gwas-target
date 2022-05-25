const { Router, json } = require("express");
const AWS = require('aws-sdk');
const crypto = require('crypto');

const apiRouter = Router();

apiRouter.use(json());

apiRouter.get("/ping", (request, response) => {
  response.json(true)
});

apiRouter.get("/submit", async (request, response) => {
  try{
    const s3 = new AWS.S3();
    const sqs = new AWS.SQS();

    // generate unique id for response
    const id = crypto.randomBytes(16).toString('hex');
    
    // assign id to body
    let body = Object.assign(request.body, {
      id,
      timestamp: new Date().toLocaleString(),
  });
  } catch (error) {
        const errorText = String(error.stderr || error);
        response.status(500).json(errorText);
    }
});

module.exports = { apiRouter };
