// 配置代理文件
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "http://localhost:5000", // 代理跨域的域名
      pathRewrite: {
        "^/api": "",
      },
      changeOrigin: true,
      // secure: false,
    })
  );
};
