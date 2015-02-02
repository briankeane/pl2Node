var db = require('../db');
var Station = require('./station');
var audioBlockSchema = require('./audioBlockSchema');
var AudioBlock = db.model('AudioBlock', audioBlockSchema);
var timestamps = require('mongoose-timestamp');

var spinSchema = db.Schema({
  airtime:            { type: Date },
  playlistPosition:   { type: Number },
  _audioBlock:        { type: db.Schema.ObjectId, ref: 'AudioBlock' },
  _station:           { type: db.Schema.ObjectId, ref: 'Station' }
});

spinSchema.plugin(timestamps);
var Spin = db.model('Spin', spinSchema);
module.exports = Spin;