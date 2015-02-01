var async = require('async');
var db = require('../../db');

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

helper.clearModels = function (models, callback) {
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