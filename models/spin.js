var db = require('../db');
var Station = require('./station');
// var moment = require('moment');
// moment().format();
var audioBlockSchema = require('./audioBlockSchema');
var AudioBlock = db.model('AudioBlock', audioBlockSchema);
var timestamps = require('mongoose-timestamp');

var spinSchema = db.Schema({
  playlistPosition:   { type: Number },
  _audioBlock:        { type: db.Schema.ObjectId, ref: 'AudioBlock' },
  _station:           { type: db.Schema.ObjectId, ref: 'Station' },
  airtime:            { type: Date },
  durationOffset:     { type: Number, default: 0 }
}, {
  toObject: { getters: true }
});

spinSchema.virtual('endTime').get(function () {
  // if it's missing the audioBlock, duration, or airtime, return null
  if (!((this.airtime) && (this._audioBlock) && (this._audioBlock.duration))) {
    return null;
  } else {
    return new Date(this.airtime.getTime() + this.duration);
  }
});

spinSchema.virtual('duration').get(function () {
  // if something is stored in _audioBlock
  if (this._audioBlock) {

    // get _audioBlock if it hasn't already been populated
    if (this._audioBlock.duration) {
      return this._audioBlock.duration + this.durationOffset;
    } else {
      return null;                    // Is this proper treatment?
    } 
  }
});

spinSchema.plugin(timestamps);
var Spin = db.model('Spin', spinSchema);
module.exports = Spin;