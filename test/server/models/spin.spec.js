var db = require('../../../db');
var Station = require('../../../models/station');
var Commentary = require('../../../models/commentary');
var Song = require('../../../models/song');
var Spin = require('../../../models/spin');
var expect = require('chai').expect;
var async = require('async');
var specHelper = require('../specHelper');

describe('a spin', function (done) { 
  var song;
  var station;
  var commentary;

  beforeEach(function (done) {
    db.connection.db.dropDatabase(function() {
      station = new Station ({ timezone: 'US Central Time',
                               secsOfCommercialPerHour: 180 });

      station.save(function (err, savedStation) {
        commentary = new Commentary({ _station: station.id,
                                      key: 'commentarykey.mp3',
                                      duration: 100 });

        song = new Song({ artist: 'Rachel Loy',
                          title: 'Stepladder',
                          album: 'Broken Machine',
                          duration: 180000,
                          key: 'ThisIsAKey.mp3',
                          echonestId: 'ECHONEST_ID' });

        specHelper.saveAll([song, commentary], function (err, models) {
          spin1 = new Spin({ _station: station.id,
                             playlistPosition: 2,
                             _audioBlock: song.id,
                             airtime: new Date(2014,1,1,12) 
                           });
          spin2 = new Spin({ _station: station.id,
                             playlistPosition: 3,
                             _audioBlock: commentary.id,
                             airtime: (new Date(2014,1,1,12)) 
                           });
          spin3 = new Spin({ _station: station.id,
                             playlistPosition: 4,
                             _audioBlock: song.id,
                             airtime: (new Date(2014,1,1,12)) 
                           });

          specHelper.saveAll([spin1, spin2, spin3], function (err, models) {
            done();
          });
        });
      });
    });
  });

  it('is created with playlistPosition, airtime, and populatable station & audioBlock', function (done) {
    Spin.findById(spin1)
    .populate('_station _audioBlock')
    .exec(function (err, foundSpin) {
      expect(foundSpin.playlistPosition).to.equal(2)
      expect(foundSpin._audioBlock.title).to.equal('Stepladder');
      expect(foundSpin._station.timezone).to.equal('US Central Time');
      expect(foundSpin.airtime.getTime()).to.equal(new Date(2014,1,1,12).getTime());
      Spin.findById(spin2)
      .populate('_station _audioBlock')
      .exec(function (err, foundSpin) {
        expect(foundSpin._audioBlock.key).to.equal('commentarykey.mp3');
        done();
      })
    });
  });

  it("calculates it's duration & returns null if not populated", function (done) {
    expect(spin1.duration).to.equal(null);  // null before population
    
    spin1.populate('_audioBlock', function (err, spin1Populated) {
      expect(spin1Populated.duration).to.equal(180000);
      
      // check for change wiith durationOffset change
      spin1.durationOffset = 10;
      expect(spin1Populated.duration).to.equal(180010);
      done();
    });
  });

  it("calculates it's endtime & returns null if not populated", function (done) {
    expect(spin1.endTime).to.equal(null);  // null before population
    
    spin1.populate('_audioBlock', function (err, spin1Populated) {
      expect(spin1Populated.endTime.getTime()).to.equal(new Date(2014,1,1,12,3).getTime());
      
      // check for change wiith durationOffset change
      spin1.durationOffset = 10;
      expect(spin1Populated.endTime.getTime()).to.equal(new Date(2014,1,1,12,3,0,10).getTime());
      done();
    });
  });
});