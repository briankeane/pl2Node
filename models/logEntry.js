var db = require('../db');
var extend = require('mongoose-schema-extend');
var AudioBlockSchema = require('./audioBlockSchema');
var Station = require('./station');
var timestamps = require('mongoose-timestamp');

var logEntrySchema = db.Schema({
  playlistPosition:   { type: Number },
  _audioBlock:        { type: db.Schema.ObjectId, ref: 'AudioBlock' },
  _station:           { type: db.Schema.ObjectId, ref: 'Station' },
  airtime:            { type: Date },
  listenersAtStart:   { type: Number },
  listenersAtFinish:  { type: Number },
  durationOffset:     { type: Number, default: 0 }
}, {
  toObject: { getters: true }
});


logEntrySchema.virtual('endTime').get(function () {
  // if it's missing the audioBlock, duration, or airtime, return null
  if (!((this.airtime) && (this._audioBlock) && (this._audioBlock.duration))) {
    return null;
  } else {
    return new Date(this.airtime.getTime() + this.duration);
  }
});

logEntrySchema.virtual('duration').get(function () {
  // if something is stored in _audioBlock
  if (this._audioBlock) {

    // get _audioBlock if it hasn't already been populated
    if (this._audioBlock.duration) {
      return this._audioBlock.duration + this.durationOffset;
    } else {
      return null;
    } 
  }
});



logEntrySchema.plugin(timestamps);
var LogEntry = db.model('LogEntry', logEntrySchema);
module.exports = LogEntry;