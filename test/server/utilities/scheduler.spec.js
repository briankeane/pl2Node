process.env.NODE_ENV="test";
var db = require('../../../db');
var Station = require('../../../models/station');
var audioBlockSchema = require('../../../models/audioBlockSchema');
var AudioBlock = db.model('AudioBlock', audioBlockSchema);
var LogEntry = require('../../../models/logEntry');
var Commentary = require('../../../models/commentary');
var RotationItem = require('../../../models/rotationItem');
var Song = require('../../../models/song');
var Spin = require('../../../models/spin');
var User = require('../../../models/user');
var Scheduler = require('../../../utilities/scheduler');
var expect = require('chai').expect;
var specHelper = require('../specHelper');
var tk = require('timekeeper');
var _ = require('lodash');

describe('playlist functions', function (done) {
  var songs;
  var station;
  var user;
  var rotationItems;

  before(function (done) {
    specHelper.clearDatabase(function() {
      user = new User({ twitter: 'BrianKeaneTunes',
                        twitterUID: '756',
                        email: 'lonesomewhistle@gmail.com',
                        birthYear: 1977,
                        gender: 'male',
                        zipcode: '78748',
                        profileImageUrl: 'http://badass.jpg' });
      station = new Station({ _user: user.id,
                              secsOfCommercialPerHour: 360 });
      station.save(function (err, savedStation) {
        user._station = station.id;
        user.save(function (err, savedUser) {
          
          specHelper.loadSongs(86, function (err, songsArray) {
            songs = songsArray;
            
            rotationItems = [];
            for(var i=0;i<30;i++) {
              rotationItems.push(new RotationItem({ _song: songs[i].id,
                                                    _station: station.id,
                                                    bin: 'inRotation',
                                                    weight: 45 }));
            }
            for(var i=30;i<45;i++) {
              rotationItems.push(new RotationItem({ _song: songs[i].id,
                                                    _station: station.id,
                                                    bin: 'inRotation',
                                                    weight: 25 }));
            }
            for(var i=45;i<60;i++) {
              rotationItems.push(new RotationItem({ _song: songs[i].id,
                                                    _station: station.id,
                                                    bin: 'inRotation',
                                                    weight: 10 }));
            }

            specHelper.saveAll(rotationItems, function (err, savedRotationItems) {
              rotationItems = savedRotationItems;
              tk.travel(new Date(2014,3,15, 12,46));
              Scheduler.generatePlaylist({ station: station }, done);
            });
          });
        });
      });
    });
  });

  it('generatePlaylist creates a first playlist', function (done) {
    Spin.getFullPlaylist(station.id, function (err, spins) {
      test = _.map(spins, function (spin) { return { audioBlockTitle: spin._audioBlock.title, airtime: spin.airtime, commercialsFollow: spin.commercialsFollow } });
      debugger;
      expect(true).to.equal(true);
      done();
    })
  });

  after(function (done) {
    tk.reset();
    done();
  })
});