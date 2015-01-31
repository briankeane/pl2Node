var db = require('../db');
var extend = require('mongoose-schema-extend');
var timestamps = require('mongoose-timestamp')

var audioBlockSchema = db.Schema({
  type:               { type: String },
  key:                { type: String },
  duration:           { type: Number }
}, { collection: 'audioBlocks', discriminatorKey: '_type' });

audioBlockSchema.plugin(timestamps);
module.exports = audioBlockSchema;