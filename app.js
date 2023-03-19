const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const port = process.env.PORT || 9000;
const cors = require('cors');
app.use(cors());

app.use('/', createProxyMiddleware({
  target: process.env.TARGET,
  changeOrigin: true,
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
    res.header("Access-Control-Allow-Credentials", "true");

    // 修改响应信息中的 cookie 域名
    if (proxyRes.headers['set-cookie']) {
      console.log(`set-cookie at ${req.headers.host}`);
      const cookies = proxyRes.headers['set-cookie'].map(cookie => {
        return cookie.replace(/(Domain=)([^;]+)/, `$1${req.headers.host}`);
      });
      proxyRes.headers['set-cookie'] = cookies;
    }
  },
  followRedirects: true
}));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
