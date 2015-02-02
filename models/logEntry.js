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

logEntrySchema.plugin(timestamps);
var LogEntry = db.model('LogEntry', logEntrySchema);
module.exports = LogEntry;