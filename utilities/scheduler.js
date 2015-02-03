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

  this.generatePlaylist = function (attrs, callback) {
    
    // adjust for timezone
    //moment().tz(station.timezone).format();

    callback();

  }
}

module.exports = new Scheduler();