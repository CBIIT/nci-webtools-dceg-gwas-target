const { createProxyMiddleware } = require("http-proxy-middleware");
const package = require("../package.json");

module.exports = function (app) {
  app.use(
    `${package.homepage}/api`,
    createProxyMiddleware({
      target: package.proxy,
      changeOrigin: true,
      pathRewrite: {
        [`^${package.homepage}/api`]: "/api",
      },
    })
  );
};
