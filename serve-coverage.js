/* eslint-disable @typescript-eslint/no-var-requires, no-console */
const express = require('express');
const path = require('path');

const app = express();

app.use('/', express.static(path.join(__dirname, 'coverage/lcov-report')));

const port = 5000;

console.log(`listening at ${port}`);

app.listen(port);
