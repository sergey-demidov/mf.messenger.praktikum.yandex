const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');

const PORT = 3080;

const key = fs.readFileSync('./example.com+5-key.pem');
const cert = fs.readFileSync('./example.com+5.pem');

const app = express();

const server = https.createServer({ key, cert }, app);

app.use('/', express.static(path.join(__dirname, 'static')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/index.html'));
});

server.listen(3443, () => { console.log('listening on 3443'); });
// app.use((req, res) => {
//   res.sendFile(path.join(__dirname, 'static/pages/404/index.html'));
// });

app.listen(PORT);
