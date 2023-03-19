const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 9000;

app.use('/', createProxyMiddleware({
  target: process.env.TARGET,
  changeOrigin: true,
  followRedirects: false,  // 关闭自动重定向

  onProxyReq: function (proxyReq, req, res) {
    if (req.method === 'OPTIONS') {
      // 如果是预检请求，手动添加 Origin 和 Access-Control-Request-Method 头
      proxyReq.setHeader('Origin', req.headers.origin);
      proxyReq.setHeader('Access-Control-Request-Method', req.method);
    }
  },

  onProxyRes: function (proxyRes, req, res) {
    // 允许跨域请求
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');

    if (proxyRes.statusCode === 302) {
      // 如果响应状态码为 302，说明存在重定向
      const location = proxyRes.headers['location'];
      if (location.startsWith('/')) {
        // 如果重定向地址以 / 开头，则需要拼接上目标地址的域名
        const targetUrl = new URL(process.env.TARGET);
        const redirectUrl = new URL(location, targetUrl.origin);
        res.setHeader('Location', redirectUrl.href);
      } else {
        // 如果重定向地址已经包含了完整的 URL，则直接返回即可
        res.setHeader('Location', location);
      }
      res.status(307).end();  // 发送 307 状态码，表示临时重定向
    } else if (proxyRes.headers['set-cookie']) {
      // 修改响应信息中的 cookie 域名
      const cookies = proxyRes.headers['set-cookie'].map(cookie => {
        return cookie.replace(/(Domain=)([^;]+)/, `$1${req.headers.host}`);
      });
      proxyRes.headers['set-cookie'] = cookies;
    }
  }
}));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
