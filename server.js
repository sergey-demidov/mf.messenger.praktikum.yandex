const express = require('express');
const path = require('path');
// const fs = require('fs');
// const https = require('https');

const app = express();
app.use('/', express.static(path.join(__dirname, 'static')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/index.html'));
});
app.listen(3000);

const coverage = express();
coverage.use('/', express.static(path.join(__dirname, 'coverage/lcov-report')));
coverage.listen(5000);

// const key = fs.readFileSync('./example.com+5-key.pem');
// const cert = fs.readFileSync('./example.com+5.pem');
// const httpsServer = https.createServer({ key, cert }, app);
// httpsServer.listen(3443, () => { console.log('listening on 3443'); });
