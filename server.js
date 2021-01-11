/* eslint-disable @typescript-eslint/no-var-requires, no-console */
const express = require('express');
const path = require('path');

const app = express();
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', `
    default-src 'self';
    connect-src https://ya-praktikum.tech;
    font-src https://fonts.gstatic.com https://fonts.googleapis.com;
    img-src 'self' blob: data: https://ya-praktikum.tech http://avatars.mds.yandex.net https://ssl.gstatic.com http://ssl.gstatic.com;
    style-src 'self' 'unsafe-inline' https://fonts.gstatic.com https://fonts.googleapis.com;
    script-src 'self' 'unsafe-inline';`
    .replace(/(\r\n|\n|\r| {2})/gm, ''));
  return next();
});
app.use('/', express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  // res.sendFile(path.join(__dirname, 'dist/index.html'));
  res.redirect('/#/404');
});

const server = app.listen(process.env.PORT || 3000);

function shutDown() {
  console.log('Received kill signal, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutDown());
process.on('SIGINT', () => shutDown());
