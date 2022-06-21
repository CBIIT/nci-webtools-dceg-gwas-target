const express = require("express");
const { getLogger } = require("./services/logger");
const { forkCluster } = require("./services/cluster");
const { apiRouter } = require("./services/api");
const { validateEnvironment } = require("./services/environment");
const fs = require('fs');
const path = require('path');
const { APP_NAME, API_PORT, LOG_LEVEL, INPUT_FOLDER, OUTPUT_FOLDER } = process.env;

// ensure that all environment variables are set
validateEnvironment();

const isMasterProcess = forkCluster();



// if in child process, create express application
if (!isMasterProcess) {
  const app = createApp();

  // start app on specified port
  app.listen(API_PORT, () => {
    app.locals.logger.info(`${APP_NAME} started on port ${API_PORT}`);
  });
}

function createApp() {
  const app = express();

  // if behind a proxy, use the first x-forwarded-for address as the client's ip address
  app.set("trust proxy", true);
  app.set("json spaces", 2);
  app.set("x-powered-by", false);

  // register services as app locals
  app.locals.logger = getLogger(APP_NAME, LOG_LEVEL);
  validateEnvironment();

  app.use("/api", apiRouter);

  if (!fs.existsSync(INPUT_FOLDER))
    fs.mkdirSync(path.resolve(INPUT_FOLDER), { recursive: true })

  if (!fs.existsSync(OUTPUT_FOLDER))
    fs.mkdirSync(path.resolve(OUTPUT_FOLDER), { recursive: true})


  return app;
}

module.exports = createApp;
