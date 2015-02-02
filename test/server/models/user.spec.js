var db = require('../../../db');
var User = require('../../../models/user');
var Station = require('../../../models/station');
var expect = require('chai').expect;
var async = require('async');



describe('a user', function () {
  var user;

  beforeEach(function (done) {
    db.connection.db.dropDatabase(function() {
      user = new User({ twitter: 'BrianKeaneTunes',
                        twitterUID: '756',
                        email: 'lonesomewhistle@gmail.com',
                        birthYear: 1977,
                        gender: 'male',
                        zipcode: '78748',
                        profileImageUrl: 'http://badass.jpg' });
      station = new Station({ _user: user.id,
                              secsOfCommercialPerHour: 150 });
      station.save(function (err, savedStation) {
        user._station = station.id;
        done();
      });
    });
  });

  it ('is created with an id, twitter_uid, email, birth_year, gender, ' + 
        'and profile_image_url', function (done) {
    expect(user.twitter).to.equal('BrianKeaneTunes');
    expect(user.twitterUID).to.equal('756');
    expect(user.email).to.equal('lonesomewhistle@gmail.com');
    expect(user.birthYear).to.equal(1977);
    expect(user.gender).to.equal('male');
    expect(user.zipcode).to.equal('78748');
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
      });
    });
  });

  it ('can get its station', function (done) {
    user.save(function (err, savedUser) {
      User
      .findById(savedUser.id)
      .populate('_station')
      .exec(function (err, foundUser) {
        expect(err).to.equal(null);
        expect(foundUser._station.secsOfCommercialPerHour).to.equal(150);
        done();
      });
    });
  });

  it ('can be updated', function (done) {
    user.save(function (err, savedUser) {
      User.findByIdAndUpdate(savedUser.id, { $set: { twitter: 'newTwitter',
                                                twitterUID: '999',
                                                email: 'new@gmail.com',
                                                birthYear: 1990,
                                                gender: 'chick',
                                                zipcode: '37217',
                                                profileImageUrl: 'http://dumbass.jpg' } }, function (err, updatedUser) {
        expect(err).to.equal(null);
        expect(updatedUser.twitter).to.equal('newTwitter');
        expect(updatedUser.twitterUID).to.equal('999');
        expect(updatedUser.email).to.equal('new@gmail.com');
        expect(updatedUser.birthYear).to.equal(1990);
        expect(updatedUser.zipcode).to.equal('37217');
        expect(updatedUser.gender).to.equal('chick');
        expect(updatedUser.profileImageUrl).to.equal('http://dumbass.jpg');
        done();
      });
    });
  });

  it ('can be deleted', function (done) {
    user.save(function (err, savedUser) {
      expect(err).to.equal(null);
      savedUser.remove();
      User.findById(savedUser.id, function(err, deletedUser) {
        expect(err).to.eq(null);
        expect(deletedUser).to.equal(null);
        done();
      });
    });0
  });

  it ('gets all users', function (done) {
    // load the database 
    loadUsers(10, function (err, users) {
      expect(users[0].twitter).to.equal('bob0');
      expect(users[4].twitter).to.equal('bob4');
      expect(users.length).to.equal(10);
      done();
    });

  });

  it ('destroys all users', function (done) {
    loadUsers(10, function (err, users) {
      User.find({}, function (err, foundUsers) {
        expect(err).to.equal(null);
        expect(foundUsers.length).to.equal(10);
        User.remove({}, function (err) {
          User.find({}, function (err, users) {
            expect(users.length).to.equal(0);
            done();
          });
        });
      });
    });
  });

  xit ('gets its station', function (done) {
    // to do
  })

  //describe('db-user-functions', function() {
  //});
});

// loads the db with x number of records
function loadUsers (desiredLength, callback) {
  var newUsers = [];
  var newUserFunctions = [];

  // make 10 users and store their 'save' functions
  for (var i=0; i<desiredLength; i++) {
    newUsers.push(new User({twitter: 'bob' + i }));
    newUserFunctions.push((function (user) {
      return function (callback) {
        user.save(callback);
      };
    })(newUsers[i]));
  }

  // add the users
  async.parallel(newUserFunctions, function (err, results) {
    User.count({}, function (err, count) {
      User.find()
      .sort('twitter')
      .exec(callback);
    });
  });
}