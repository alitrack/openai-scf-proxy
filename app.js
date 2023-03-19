const express = require('express')
const {
  createProxyMiddleware
} = require('http-proxy-middleware');
const app = express()
const port = process.env.PORT || 9000

app.use('/', createProxyMiddleware({
  target: process.env.TARGET,
  changeOrigin: true,
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE';
    
    // 修改响应信息中的 cookie 域名
    cookieDomainRewrite: "localhost" // 可以为 false，表示不修改
  }
}));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
