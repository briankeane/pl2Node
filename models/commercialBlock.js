var db = require('../db');
var extend = require('mongoose-schema-extend');
var AudioBlockSchema = require('./audioBlockSchema');

var commercialBlockSchema = AudioBlockSchema.extend({
});

var CommercialBlock = db.model('CommercialBlock', commercialBlockSchema);
module.exports = CommercialBlock;