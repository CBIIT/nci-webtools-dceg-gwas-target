import path from "path";
import AWS from "aws-sdk";
import { mkdir } from "fs/promises";
import { Router, json } from "express";
import { runMagma } from "/services/analysis.js";

const { INPUT_FOLDER, OUTPUT_FOLDER, DATA_BUCKET, QUEUE_NAME, QUEUE_LONG_PULL_TIME, VISIBILITY_TIMEOUT } = process.env;

(async function main() {

  receiveMessage();
})();

async function processMessage(message) {

}

async function receiveMessage() {

  const { QueueUrl } = await sqs.getQueueUrl({
    QueueName: QUEUE_NAME
  }).promise();

  try {
    const data = await sqs.receiveMessage({
      QueueUrl: QueueUrl,
      MaxNumberOfMessages: 1,
      VisibilityTimeout: VISIBILITY_TIMEOUT,
      WaitTimeSeconds: 20,
    }).promise();

    if (data.Messages && data.Messages.length > 0) {
      const message = data.Messages[0];
      const params = JSON.parse(message.Body);

      const intervalId = setInterval(_ => sqs.changeMessageVisibility({
        QueueUrl: QueueUrl,
        ReceiptHandle: message.ReceiptHandle,
        VisibilityTimeout: VISIBILITY_TIMEOUT
      }).send(), 1000 * (VISIBILITY_TIMEOUT - 1));

      // processMessage should return a boolean status indicating success or failure
      const status = await processMessage(params);
      clearInterval(intervalId);
    }
  } catch (e) {


  } finally {
    // schedule receiving next message
    setTimeout(receiveMessage, 1000 * (QUEUE_LONG_PULL_TIME || 60));
  }
}