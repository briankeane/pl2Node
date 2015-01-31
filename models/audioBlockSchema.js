var db = require('../db');
var extend = require('mongoose-schema-extend');

var audioBlockSchema = db.Schema({
  type:               { type: String },
  key:                { type: String },
  duration:           { type: Number },
  created:            { type: Date, default: Date.now },
  updated:            { type: Date, default: Date.now }
}, { collection: 'audioBlocks', discriminatorKey: '_type' });

module.exports = audioBlockSchema;