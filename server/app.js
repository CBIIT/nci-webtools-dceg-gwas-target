const express = require("express");
const { validateEnvironment } = require("./services/environment");
const { logRequests, logErrors } = require("./services/middleware");
const { getLogger } = require("./services/logger");
const { forkCluster } = require("./services/cluster");
const { api } = require("./services/api");
const { APP_NAME, API_PORT, LOG_LEVEL } = process.env;

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
  app.locals.logger = getLogger(APP_NAME, { level: LOG_LEVEL });

  // register middleware
  app.use(logRequests());
  app.use("/api", api);
  app.use(logErrors());

  return app;
}

module.exports = createApp;
