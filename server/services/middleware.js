export function publicCacheControl(maxAge) {
  return (request, response, next) => {
    if (request.method === "GET") response.set("Cache-Control", `public, max-age=${maxAge}`);
    next();
  };
}

export function logRequests(formatter = (request) => [request.path, request.query, request.body]) {
  return (request, response, next) => {
    const { logger } = request.app.locals;
    request.startTime = new Date().getTime();
    logger.info(formatter(request));
    next();
  };
}

export function logErrors(error, request, response, next) {
  const { name, message } = error;
  request.app.locals.logger.error(error);
  response.status(500).json(`${name}: ${message}`);
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
