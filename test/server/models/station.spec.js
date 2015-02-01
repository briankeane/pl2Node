var db = require('../../../db');
var User = require('../../../models/user');
var Song = require('../../../models/song');
var Station = require('../../../models/station');
var expect = require('chai').expect;
var async = require('async');
var specHelper = require('../specHelper');

describe('a station', function () {
  var song;
  var user;
  var station;

  beforeEach(function (done) {
    db.connection.db.dropDatabase(function() {
      song = new Song({ artist: 'Rachel Loy',
                        title: 'Stepladder',
                        album: 'Broken Machine',
                        duration: 180000,
                        key: 'ThisIsAKey.mp3',
                        echonestId: 'ECHONEST_ID' });

      user = new User({ twitter: 'BrianKeaneTunes',
                          twitterUID: '756',
                          email: 'lonesomewhistle@gmail.com',
                          birthYear: 1977,
                          gender: 'male',
                          profileImageUrl: 'http://badass.jpg' });

      station = new Station ({ _user: user.id,
                               secsOfCommercialPerHour: 3 }) 


      specHelper.saveAll([song, user, station], function (err, objects) {
        done();
      });
    });
  });

  it ('is created', function (done) {
    expect(station.id).to.not.equal(null);
    expect(station.secsOfCommercialPerHour).to.equal(3);
    expect(station._user.equals(user._id)).to.equal(true);
    done();
  });

  xit ('contains its users', function (done) {

  })

  xit ('returns a genre hash', function (done) {

  })

  describe ('make_log_current', function () {

    xit ('gets the average number of listeners', function (done) {

    });
  });
});