var db = require('../../../db');
var LogEntry = require('../../../models/logEntry');
var Station = require('../../../models/station');
var Commentary = require('../../../models/commentary');
var Song = require('../../../models/song');
var Spin = require('../../../models/spin');
var expect = require('chai').expect;
var async = require('async');
var specHelper = require('../specHelper');

describe('a logEntry', function (done) { 
  var song;
  var station;
  var logEntry;
  
  beforeEach(function (done) {
    station = new Station ({ });  
    song  = new Song({ duration: 1000 });
    specHelper.saveAll([station, song], function (err, savedModels) {
      logEntry = new LogEntry({ _station: station.id,
                                playlistPosition: 76,
                                _audioBlock: song.id,
                                airtime: new Date(1983,4,15,18),
                                listenersAtStart: 55,
                                listenersAtFinish: 57,
                                durationOffset: 10 });
      logEntry.save(function (err, savedLogEntry) {
        done();
      });
    });
  });

  it('can be created', function (done) {
    expect(logEntry._station.equals(station.id)).to.equal(true);
    expect(logEntry.playlistPosition).to.equal(76);
    expect(logEntry._audioBlock.equals(song.id)).to.equal(true);
    expect(logEntry.airtime.getTime()).to.equal(new Date(1983,4,15,18).getTime());
    expect(logEntry.listenersAtStart).to.equal(55);
    expect(logEntry.listenersAtFinish).to.equal(57);
    expect(logEntry.durationOffset).to.equal(10);
    done();
  });
});