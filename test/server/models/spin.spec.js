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
                             airtime: new Date(2014,1,1,12) });
          spin2 = new Spin({ _station: station.id,
                             playlistPosition: 3,
                             _audioBlock: commentary.id,
                             airtime: new Date(2014,1,1,12) });
          spin3 = new Spin({ _station: station.id,
                             playlistPosition: 4,
                             _audioBlock: song.id,
                             airtime: new Date(2014,1,1,12) });

          specHelper.saveAll([spin1, spin2, spin3], function (err, models) {
            done();
          });
        });
      });
    });
  });

  it('is created with playlistPosition, airtime, and populatable station & audioBlock', function (done) {
    Spin.find()
    .populate('_station _audioBlock')
    .exec(function (err, foundSpins) {
      expect(foundSpins[0].playlistPosition).to.equal(2)
      expect(foundSpins[0]._audioBlock.title).to.equal('Stepladder');
      expect(foundSpins[0]._station.timezone).to.equal('US Central Time');
      expect(foundSpins[1]._audioBlock.key).to.equal('commentarykey.mp3');
      expect(foundSpins[0].airtime.getTime()).to.equal(new Date(2014,1,1,12).getTime());
      done();
    })

  });
});