var db = require('../db');
var User = require('./user');
var timestamps = require('mongoose-timestamp');

var stationSchema = db.Schema({
  _user:                                  { type: db.Schema.ObjectId, ref: 'User'},
  secsOfCommercialPerHour:                { type: Number },
  lastAccuratePlaylistPosition:           { type: Number },
  lastAccurateAirtime:                    { type: Date },
  averageDailyListeners:                  { type: Number },
  timezone:                               { type: String },
  averageDailyListenersCalculationDate:   { type: Date }
});

stationSchema.plugin(timestamps);
var Station = db.model('Station', stationSchema);
module.exports = Station;