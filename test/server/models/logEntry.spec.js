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
    specHelper.clearDatabase(function () {
      
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

  it('calculates duration and endTime', function (done) {
    logEntry.populate('_audioBlock', function (err, foundLogEntry) {
      expect(logEntry.duration).to.equal(1010);
      expect(logEntry.endTime.getTime()).to.equal(new Date(1983,4,15,18,00,01,10).getTime());
      done();
    });
  });
});

describe('Log Methods', function (done){
  var logEntries = [];
  var song = [];
  var station;
  
  beforeEach(function (done) {

    specHelper.clearDatabase(function () {
      station = new Station({});
      station.save(function (err, savedStation) {
        song = new Song({ duration: 180000 });
        song.save(function (err, savedSong) {
          for (var i=0;i<30;i++) {
            logEntries.push(new LogEntry({  _station: station.id,
                                            _audioBlock: song.id,
                                            playlistPosition: 76 + i,
                                            airtime: new Date(new Date(1983,4,15,18).getTime() + (i*360000)),
                                            listenersAtStart: i + 55,
                                            listenersAtFinish: i+57 }));
          }
          specHelper.saveAll(logEntries, function (err, savedLogEntries) {
            done();
          });
        });
      })
    });
  });

  it('can get recent entries', function (done) {
    LogEntry.getRecent({ _station: station.id, count: 15 }, function (err, gottenEntries) {
      expect(gottenEntries.length).to.equal(15);
      expect(gottenEntries[0].playlistPosition).to.equal(105);
      expect(gottenEntries[14].playlistPosition).to.equal(91);
      done();
    });
  });

    it('can get the full station log', function (done) {
    LogEntry.getFullStationLog(station.id, function (err, gottenEntries) {
      expect(gottenEntries.length).to.equal(30);
      expect(gottenEntries[0].playlistPosition).to.equal(105);
      expect(gottenEntries[29].playlistPosition).to.equal(76);
      done();
    });

    it('can get a logEntry by its playlistPosition and _station', function (done) {
      LogEntry.getEntryByPlaylistPosition({ _station: station.id,
                                            playlistPosition: 76
                                          }, function (err, entry) {
        expect(entry.id.equals(logEntries[0].id)).to.equal(true);
        done();
      });
    });
  });
});
    