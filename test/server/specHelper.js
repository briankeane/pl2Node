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

function Helper() {
  
  var self = this;

  this.saveAll = function (objects, callback) {
    var functions = [];
    
    for (var i=0; i < objects.length; i++) {
      functions.push((function(obj) {
          return function(callback) {
              obj.save(callback);
          };
        })(objects[i]));
    }

    async.parallel(functions, function (err, results) {
      callback(err, results);
    });
  };
  
  this.clearDatabase = function (callback) {
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
      callback(err, results);
    });
  };
  
  this.loadSongs = function (count, callback) {
    var songs = [];

    for (var i=0;i<count;i++) {
      songs.push(new Song({ artist: 'artist#: ' + i,
                            title: 'title#: '+ i,
                            album: 'album#: ' + i,
                            duration: 180000,
                            key: 'key#: '+ i,
                            echonestId: 'echonestId#:' + i }));
    }
    debugger;
    self.saveAll(songs, callback);
  }
}

module.exports = new Helper();