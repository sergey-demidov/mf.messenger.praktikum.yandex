const express = require('express');
const reload = require('reload');
const PORT = 3000;

const app = express();
app.use('/', express.static(__dirname + '/dist/'));

reload(app).then(() => {
  app.listen(PORT, function () {
    console.log(`server started at http://localhost:${PORT}`)
  })
}).catch(function (err) {
  console.error('Reload could not start', err)
})
