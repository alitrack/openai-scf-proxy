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
    proxyRes.headers["Access-Control-Allow-Credentials"] = "true";
    // 在这里可以添加登录逻辑，并将登录后的 cookie 传递给目标服务器
    if (req.session.user) {
      req.setHeader('Cookie', `sessionId=${req.sessionID}`);
    }    
  },

        // 修改响应信息中的 cookie 域名
  cookieDomainRewrite: "localhost" // 可以为 false，表示不修改
}));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
