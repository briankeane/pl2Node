var db = require('../../../db');
var User = require('../../../models/user');
var Station = require('../../../models/station');
var expect = require('chai').expect;

describe('a user', function () {
  var user;

  beforeEach(function (done) {
    User.remove(done)
    user = new User({ twitter: 'BrianKeaneTunes',
                      twitterUID: '756',
                      email: 'lonesomewhistle@gmail.com',
                      birthYear: 1977,
                      gender: 'male',
                      profileImageUrl: 'http://badass.jpg' });
  });

  it ('is created with an id, twitter_uid, email, birth_year, gender, ' + 
        'and profile_image_url', function () {
    expect(user.twitter).to.equal('BrianKeaneTunes');
    expect(user.twitterUID).to.equal('756');
    expect(user.email).to.equal('lonesomewhistle@gmail.com');
    expect(user.birthYear).to.equal(1977);
    expect(user.gender).to.equal('male');
    expect(user.profileImageUrl).to.equal('http://badass.jpg')
  });

  it ('persists a user', function () {
    user.save(function (err, user) {
      expect(err).to.equal(null);
      User.findOne({ twitter: 'BrianKeaneTunes' }, function (err, gottenUser) {
        expect(err).to.equal(null);
        expect(gottenUser.twitter).to.equal('BrianKeaneTunes');
        expect(gottenUser.twitterUID).to.equal('756');
        expect(gottenUser.email).to.equal('lonesomewhistle@gmail.com');
        expect(gottenUser.birthYear).to.equal(1977);
        expect(gottenUser.gender).to.equal('male');
        expect(gottenUser.profileImageUrl).to.equal('http://badass.jpg');
      });
    });
  });

  xit ('gets its station', function () {
    // to do
  })

  //describe('db-user-functions', function() {
  //});
});