var db = require('../db');

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

var User = db.model('User', userSchema);
module.exports = User;