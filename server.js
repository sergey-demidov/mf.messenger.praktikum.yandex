/* eslint-disable @typescript-eslint/no-var-requires, no-console */
const express = require('express');
const path = require('path');

const app = express();
app.use('/', express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
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
