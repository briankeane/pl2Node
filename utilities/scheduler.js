var db = require('../db');
var Station = require('../models/station');
var audioBlockSchema = require('../models/audioBlockSchema');
var AudioBlock = db.model('AudioBlock', audioBlockSchema);
var LogEntry = require('../models/logEntry');
var Commentary = require('../models/commentary');
var RotationItem = require('../models/rotationItem');
var Song = require('../models/song');
var Spin = require('../models/spin');
var User = require('../models/user');
var moment = require('moment-timezone');


function Scheduler() {
  var self = this;
  var sampleArrayHolder;

  this.generatePlaylist = function (attrs, callback) {
    
    // all times utc
    moment().utc().format();

    var station = attrs.station;
    var sampleArray = self.createSampleArray(station);



      callback();

  }

  this.createSampleArray = function (station) {

  }
}

module.exports = new Scheduler();