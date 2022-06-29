import express from "express";
import fs from "fs";
import { getLogger } from "./services/logger.js";
import { apiRouter } from "./services/api.js";
import { validateEnvironment } from "./services/environment.js";
import { logErrors, logRequests } from "./services/middleware.js";
const { APP_NAME, API_PORT, LOG_LEVEL, INPUT_FOLDER, OUTPUT_FOLDER } = process.env;

// ensure that all environment variables are set
validateEnvironment();

// start app on specified port
const app = createApp();
app.listen(API_PORT, () => {
  app.locals.logger.info(`${APP_NAME} started on port ${API_PORT}`);
});

export function createApp() {
  const app = express();

  // if behind a proxy, use the first x-forwarded-for address as the client's ip address
  app.set("trust proxy", true);
  app.set("json spaces", 2);
  app.set("x-powered-by", false);

  // register services as app locals
  app.locals.logger = getLogger(APP_NAME, LOG_LEVEL);
  app.use(logRequests());
  app.use("/api", apiRouter);
  app.use(logErrors);

  for (const folder of [INPUT_FOLDER, OUTPUT_FOLDER]) fs.mkdirSync(folder, { recursive: true });

  return app;
}
