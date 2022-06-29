import util from "util";

export function publicCacheControl(maxAge) {
  return (request, response, next) => {
    if (request.method === "GET") response.set("Cache-Control", `public, max-age=${maxAge}`);
    next();
  };
}

export function defaultRequestFormatter(request) {
  const formatObject = (obj) => (!obj || Object.keys(obj).length === 0 ? "" : util.format(obj));
  const parts = [request.method, request.path, formatObject(request.query), formatObject(request.body)];
  return parts.join(" ");
}

export function logRequests(formatter = defaultRequestFormatter) {
  return (request, response, next) => {
    const { logger } = request.app.locals;
    request.startTime = new Date().getTime();
    logger.info(formatter(request));
    next();
  };
}

export function logErrors(error, request, response, next) {
  const { logger } = request.app.locals;
  const { name, message } = error;
  logger.error(error.stack);
  response.status(500).json({ error: `${name}: ${message}` });
  next(); // unnecessary, but included to address unused parameter warning
}

/**
 * Passes async errors to error-handling middleware
 * @param {function} fn - An asynchronous middleware function
 * @returns The middleware function decorated with an error handler
 */
export function withAsync(fn) {
  return async (request, response, next) => {
    try {
      return await fn(request, response, next);
    } catch (error) {
      next(error);
    }
  };
}
