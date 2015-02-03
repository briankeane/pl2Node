process.env.NODE_ENV="test";
var async = require('async');
var db = require('../../db');
var audioBlockSchema = require('../../models/audioBlockSchema');
var AudioBlock = db.model('AudioBlock', audioBlockSchema);
var LogEntry = require('../../models/logEntry');
var Commentary = require('../../models/commentary');
var RotationItem = require('../../models/rotationItem');
var Song = require('../../models/song');
var Spin = require('../../models/spin');
var Station = require('../../models/station');
var User = require('../../models/user');

var helper = {};

helper.saveAll = function (objects, callback) {
  var functions = [];
  
  for (var i=0; i < objects.length; i++) {
    functions.push((function(obj) {
        return function(callback) {
            obj.save(callback);
        };
      })(objects[i]));
  }

  async.parallel(functions, function (err, results) {
    callback();
  });
};

helper.clearDatabase = function (callback) {
  models = [
            AudioBlock, 
            RotationItem, 
            Spin, 
            Station, 
            User,
            LogEntry
            ]

  var functions = [];

  for (var i=0; i < models.length; i++) {
    functions.push((function(model) {
        return function(callback) {
            model.remove({}, callback);
        };
    })(models[i]));
  }

  async.parallel(functions, function (err, results) {
    callback();
  });
};

module.exports = helper;