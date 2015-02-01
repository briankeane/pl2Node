var db = require('../db');
var extend = require('mongoose-schema-extend');
var AudioBlockSchema = require('./audioBlockSchema');
var Station = require('./station');
var timestamps = require('mongoose-timestamp');

var commentarySchema = AudioBlockSchema.extend({
  _station:           { type: db.Schema.ObjectId, ref: 'Station' }
});

var Commentary = db.model('Commentary', commentarySchema);
module.exports = Commentary;