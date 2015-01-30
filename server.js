var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// use correct port for environment
var port = process.env.PORT || 3000

var server = app.listen(3000, function () {
  console.log('Server listening on ', 3000);
});