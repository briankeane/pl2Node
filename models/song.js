var db = require('../db');
var extend = require('mongoose-schema-extend');
var AudioBlockSchema = require('./audioBlockSchema');

var songSchema = AudioBlockSchema.extend({
  artist:             { type: String },
  title:              { type: String },
  album:              { type: String },
  echonestId:         { type: String },
  albumArtworkUrl:    { type: String },
  itunesTrackViewUrl: { type: String }
});

songSchema.statics.findAllMatchingTitle = function (title, cb) {
  Song
  .find({ title: new RegExp('^'+title, "i") })
  .sort('title')
  .exec(cb);
}

var Song = db.model('Song', songSchema);
module.exports = Song;