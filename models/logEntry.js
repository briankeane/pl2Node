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

logEntrySchema.statics.getRecent = function (attrs, callback) {
  // if there's no count, set the limit 
  if (!attrs.count) { 
    attrs.count = 1000; 
  }

  LogEntry
  .find({ _station: attrs._station })
  .sort('-playlistPosition')
  .limit(attrs.count)
  .exec(callback);
};

logEntrySchema.statics.getFullStationLog = function (stationId, callback) {
  LogEntry
  .find({ _station: stationId })
  .sort('-playlistPosition')
  .exec(callback);
};

logEntrySchema.statics.getLog = function (attrs, callback) {
  var query = { $and: [{ _station: attrs._station}] };
  
  // add endTime limit to query
  if (attrs.endTime) {
    query['$and'].push({ airtime: { $lte: attrs.endTime } });
  }

  // add startTime limit to query
  if (attrs.startTime) {
    query['$and'].push({ airtime: { $gte: attrs.startTime } });
  }

  // add startingPlaylistPosition limit to query
  if (attrs.startingPlaylistPosition) {
    query['$and'].push({ playlistPosition: { $gte: attrs.startingPlaylistPosition } });
  }

  // add endingPlaylistPosition limit to query
  if (attrs.endingPlaylistPosition) {
    query['$and'].push({ playlistPosition: { $lte: attrs.endingPlaylistPosition } });
  }

  Log
  .find(query)
  .sort('-playlistPosition')
  .exec(callback);
};

logEntrySchema.statics.getEntryByPlaylistPosition = function (attrs, callback) {
  LogEntry
  .findOne({ _station: attrs._station, playlistPosition: attrs.playlistPosition })
  .exec(callback);
};


logEntrySchema.plugin(timestamps);
var LogEntry = db.model('LogEntry', logEntrySchema);
module.exports = LogEntry;