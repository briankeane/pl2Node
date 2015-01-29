var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var server = app.listen(3000, function () {
  console.log('Server listening on ', 3000);
});