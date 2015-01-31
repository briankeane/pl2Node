var db = require('../db');
var extend = require('mongoose-schema-extend');
var AudioBlockSchema = require('./audioBlockSchema');

var commentarySchema = AudioBlockSchema.extend({
  _station:           { type: Schema.ObjectId, ref: 'Station' }
});

var Commentary = db.model('Commentary', commentarySchema);
module.exports = Commentary;