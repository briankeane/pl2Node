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
        'and profile_image_url', function (done) {
    expect(user.twitter).to.equal('BrianKeaneTunes');
    expect(user.twitterUID).to.equal('756');
    expect(user.email).to.equal('lonesomewhistle@gmail.com');
    expect(user.birthYear).to.equal(1977);
    expect(user.gender).to.equal('male');
    expect(user.profileImageUrl).to.equal('http://badass.jpg');
    done();
  });

  it ('persists a user', function (done) {
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
        done();
      });
    });
  });

  it ('can be gotten by its id', function (done) {
    user.save(function (err, savedUser) {
      debugger;
      User.findById(savedUser.id, function (err, gottenUser) {
        expect(err).to.equal(null);
        expect(gottenUser.twitter).to.equal('BrianKeaneTunes');
        done();
      });
    });
  });

  it ('can be gotten by its twitter', function (done) {
    user.save(function (err, savedUser) {
      User.findOne({ twitter: 'BrianKeaneTunes' }, function (err, gottenUser) {
        expect(err).to.equal(null);
        expect(savedUser.twitter).to.equal('BrianKeaneTunes');
        expect(gottenUser.email).to.equal('lonesomewhistle@gmail.com');
        expect(gottenUser.twitterUID).to.equal('756');
        done();
      })
    })
  })

  it ('can be updated', function (done) {
    user.save(function (err, savedUser) {
      User.findByIdAndUpdate(savedUser.id, { $set: { twitter: 'newTwitter',
                                                twitterUID: '999',
                                                email: 'new@gmail.com',
                                                birthYear: 1990,
                                                gender: 'chick',
                                                profileImageUrl: 'http://dumbass.jpg' } }, function (err, updatedUser) {
        expect(err).to.equal(null);
        expect(updatedUser.twitter).to.equal('newTwitter');
        expect(updatedUser.twitterUID).to.equal('999');
        expect(updatedUser.email).to.equal('new@gmail.com');
        expect(updatedUser.birthYear).to.equal(1990);
        expect(updatedUser.gender).to.equal('chick');
        expect(updatedUser.profileImageUrl).to.equal('http://dumbass.jpg');
        done();
      });
    });
  });

  xit ('gets its station', function (done) {
    // to do
  })

  //describe('db-user-functions', function() {
  //});
});