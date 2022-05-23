const { Router, json } = require("express");
const cors = require("cors");
const { APP_BASE_URL } = process.env;
const api = Router();
const AWS = require('aws-sdk');
const crypto = require('crypto');

api.use(cors());
api.use(json());


router.get("/ping", (request, response) => {
  response.json(true)
});

router.get("/submit", async (request, response) => {
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

module.exports = { api };
