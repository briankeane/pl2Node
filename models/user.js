var db = require('../db');
var timestamps = require('mongoose-timestamp');

var userSchema = db.Schema({
  twitter:            { type: String },
  twitterUID:         { type: String },
  email:              { type: String },
  birthYear:          { type: Number },
  gender:             { type: String },
  profileImageUrl:    { type: String }
});


userSchema.methods.trueOrFalse = function () {
  return 'true AND false, mf';
}

userSchema.plugin(timestamps);
var User = db.model('User', userSchema);
module.exports = User;