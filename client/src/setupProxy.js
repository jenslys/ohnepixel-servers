const { createProxyMiddleware } = require('http-proxy-middleware');

// This file is used to proxy requests from the React app to the Express server
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL,
      changeOrigin: true,
    })
  );
};
