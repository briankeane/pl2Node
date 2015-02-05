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
var Helper = require('../../../utilities/helper');

describe('playlist functions', function (done) {
  var songs;
  var station;
  var user;
  var rotationItems;

  beforeEach(function (done) {
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
              tk.freeze(new Date(2014,3,15, 12,46));
              Scheduler.generatePlaylist({ station: station }, function (err, returnedStation) {
                tk.travel(new Date(2014,3,15, 12,46,01));
                done();
              });
            });
          });
        });
      });
    });
  });

  it('generatePlaylist creates a first playlist', function (done) {
    Spin.getFullPlaylist(station.id, function (err, spins) {
      LogEntry.getFullStationLog(station.id, function (err, logEntries) {
        // make sure all logEntry values stored
        expect(logEntries.length).to.equal(1);
        expect(logEntries[0].playlistPosition).to.equal(1);
        expect(logEntries[0].airtime.getTime()).to.equal(new Date(2014,3,15, 12,46).getTime());
        expect(logEntries[0]._audioBlock.title).to.exist;
        expect(logEntries[0]._station).to.exist;
        expect(logEntries[0].durationOffset).to.equal(0);
        
        // make sure all spin values stored
        expect(spins.length).to.equal(36);
        expect(spins[0].playlistPosition).to.equal(2);
        expect(spins[0].airtime.getTime()).to.equal(new Date(2014,3,15, 12,49).getTime());
        expect(spins[0]._audioBlock.title).to.exist;
        expect(spins[0]._station).to.exist;
        expect(spins[0].durationOffset).to.equal(0);
  
        // make sure commercials are in the right place
        expect(spins[0].commercialsFollow).to.equal(false);
        expect(spins[3].commercialsFollow).to.equal(true);
        expect(spins[12].commercialsFollow).to.equal(true);
        expect(spins[21].commercialsFollow).to.equal(true);
        done();
      });
    });
  });
  
  it('updates the lastAccuratePlaylistPosition & lastAccurateAirtime', function (done) {
    Station.findById(station.id, function (err, foundStation) {
      expect(station.lastAccuratePlaylistPosition).to.equal(37);
      expect(foundStation.lastAccuratePlaylistPosition).to.equal(37);
      Spin.getByPlaylistPosition({ _station: station.id,
                                  playlistPosition: 37
                                }, function (err, foundSpin) {
        expect(station.lastAccurateAirtime.getTime()).to.equal(foundSpin.endTime.getTime());
        expect(foundStation.lastAccurateAirtime.getTime()).to.equal(foundSpin.endTime.getTime());
        done();
      });
    });
  });

  describe('updateAirtimes', function (done) {
    
    it('just returns if there is no playlist', function (done) {
      station2 = new Station({ secsOfCommercialPerHour: 30 });
      station2.save(function (err, savedNewStation) {
        Scheduler.updateAirtimes({ station: savedNewStation }, function (err, station2) {
          expect(err).to.equal(null);
          expect(station2.lastAccuratePlaylistPosition).to.be.an('undefined');
          done();
        });
      });
    });

    it('updates the airtimes', function (done) {
      Spin.getFullPlaylist(station.id, function (err, fullPlaylist) {
        // screw up some airtimes
        for (var i=10; i<fullPlaylist.length; i++) {
          fullPlaylist[i].airtime = new Date(1983,3,15);
        }

        station.lastAccuratePlaylistPosition = fullPlaylist[9].playlistPosition;
        station.lastAccurateAirtime = fullPlaylist[9].airtime;
        
        // group all objects to be saved and save them
        var toSave = fullPlaylist.slice(10,100);
        toSave.push(station);
        specHelper.saveAll(toSave, function (err, savedObjects) {
          // grab the updated station

          station = savedObjects[26];

          Scheduler.updateAirtimes({ station: station }, function (err, returnedStation) {
            Spin.getFullPlaylist(station.id, function (err, fixedPlaylist) {
              expect(fixedPlaylist[22].airtime.getTime()).to.equal(new Date(2014,3,15, 14,04).getTime());
              expect(fixedPlaylist[21].commercialsFollow).to.equal(true);
              expect(fixedPlaylist[34].airtime.getTime()).to.equal(new Date(2014,3,15, 14,43).getTime());
              expect(fixedPlaylist[10].airtime.getTime()).to.equal(new Date(2014,3,15, 13,22).getTime());
              expect(fixedPlaylist[11].airtime.getTime()).to.equal(new Date(2014,3,15, 13,25).getTime());
              done();
            });
          });
        });
      });
    });

    it('updates the airtimes if commercial leads in', function (done) {
      Spin.getFullPlaylist(station.id, function (err, fullPlaylist) {
        // screw up some airtimes -- starting with a commercialsFollow=true spin
        for (var i=5; i<fullPlaylist.length; i++) {
          fullPlaylist[i].airtime = new Date(1983,3,15);
        }

        station.lastAccuratePlaylistPosition = fullPlaylist[4].playlistPosition;
        station.lastAccurateAirtime = fullPlaylist[9].airtime;
        
        // group all objects to be saved and save them
        var toSave = fullPlaylist.slice(10,100);
        toSave.push(station);
        specHelper.saveAll(toSave, function (err, savedObjects) {
          // grab the updated station
          station = savedObjects[26];

          Scheduler.updateAirtimes({ station: station }, function (err, returnedStation) {
            Spin.getFullPlaylist(station.id, function (err, fixedPlaylist) {
              expect(fixedPlaylist[22].airtime.getTime()).to.equal(new Date(2014,3,15, 14,04).getTime());
              expect(fixedPlaylist[21].commercialsFollow).to.equal(true);
              expect(fixedPlaylist[34].airtime.getTime()).to.equal(new Date(2014,3,15, 14,43).getTime());
              expect(fixedPlaylist[4].airtime.getTime()).to.equal(new Date(2014,3,15, 13,04).getTime());
              expect(fixedPlaylist[5].airtime.getTime()).to.equal(new Date(2014,3,15, 13,07).getTime());
              done();
            });
          });
        });
      });
    });

    it('updates the airtimes if only the log is correct', function (done) {
      Spin.getFullPlaylist(station.id, function (err, fullPlaylist) {
        // screw up some airtimes -- starting with a commercialsFollow=true spin
        for (var i=0; i<fullPlaylist.length; i++) {
          fullPlaylist[i].airtime = new Date(1983,3,15);
        }

        station.lastAccuratePlaylistPosition = fullPlaylist[4].playlistPosition;
        station.lastAccurateAirtime = fullPlaylist[9].airtime;
        
        // group all objects to be saved and save them
        var toSave = fullPlaylist.slice(10,100);
        toSave.push(station);
        specHelper.saveAll(toSave, function (err, savedObjects) {
          // grab the updated station
          station = savedObjects[26];

          Scheduler.updateAirtimes({ station: station }, function (err, returnedStation) {
            Spin.getFullPlaylist(station.id, function (err, fixedPlaylist) {
              expect(fixedPlaylist[22].airtime.getTime()).to.equal(new Date(2014,3,15, 14,04).getTime());
              expect(fixedPlaylist[21].commercialsFollow).to.equal(true);
              expect(fixedPlaylist[34].airtime.getTime()).to.equal(new Date(2014,3,15, 14,43).getTime());
              expect(fixedPlaylist[4].airtime.getTime()).to.equal(new Date(2014,3,15, 13,04).getTime());
              expect(fixedPlaylist[5].airtime.getTime()).to.equal(new Date(2014,3,15, 13,07).getTime());
              done();
            });
          });
        });
      });
    });

  it('updates the airtimes starting from the log, commercialsFollow is true', function (done) {
      Spin.getFullPlaylist(station.id, function (err, fullPlaylist) {
        // screw up some airtimes -- starting with a commercialsFollow=true spin
        for (var i=0; i<fullPlaylist.length; i++) {
          fullPlaylist[i].airtime = new Date(1983,3,15);
        }

        LogEntry.getEntryByPlaylistPosition({ _station: station.id,
                                              playlistPosition: 1
                                            }, function (err, logEntry) {

          logEntry.airtime = new Date(2014,3,15, 12,58);
          logEntry.commercialsFollow = true;
          station.lastAccuratePlaylistPosition = logEntry.playlistPosition;
          station.lastAccurateAirtime = logEntry.airtime;
          
          // group all objects to be saved and save them
          var toSave = fullPlaylist.slice(10,100);
          toSave.push(station);
          toSave.push(logEntry);
          specHelper.saveAll(toSave, function (err, savedObjects) {
            // grab the updated station
            station = savedObjects[26];

            Scheduler.updateAirtimes({ station: station }, function (err, returnedStation) {
              Spin.getFullPlaylist(station.id, function (err, fixedPlaylist) {
                expect(fixedPlaylist[22].airtime.getTime()).to.equal(new Date(2014,3,15, 14,16).getTime());
                expect(fixedPlaylist[8].commercialsFollow).to.equal(true);
                expect(fixedPlaylist[34].airtime.getTime()).to.equal(new Date(2014,3,15, 14,55).getTime());
                expect(fixedPlaylist[4].airtime.getTime()).to.equal(new Date(2014,3,15, 13,16).getTime());
                expect(fixedPlaylist[5].airtime.getTime()).to.equal(new Date(2014,3,15, 13,19).getTime());
                done();
              });
            });
          });
        });
      });
    });
  });
  
  it('does not extend the playlist past 24hrs', function (done) {
    Scheduler.generatePlaylist({ station: station,
                                playlistEndTime: new Date(2014,3,25, 16,46)
                              }, function (err, updatedStation) {
      Spin.getFullPlaylist(station.id, function (err, newPlaylist) {
        expect(newPlaylist.length).to.equal(432)
        expect(newPlaylist[34].airtime.getTime()).to.equal(new Date(2014,3,15, 14,43).getTime());
        expect(newPlaylist[35].airtime.getTime()).to.equal(new Date(2014,3,15, 14,46).getTime());
        done();
      })
    });
  });

  it('extends the playlist 4 hours', function (done) {
    Scheduler.generatePlaylist({ station: station,
                                playlistEndTime: new Date(2014,3,15, 16,46)
                              }, function (err, updatedStation) {
      Spin.getFullPlaylist(station.id, function (err, newPlaylist) {
                        test = _.map(newPlaylist, function (spin) { return { playlistPosition: spin.playlistPosition, airtime: spin.airtime, commercialsFollow: spin.commercialsFollow }});
                debugger;
        expect(newPlaylist.length).to.equal(72)
        expect(newPlaylist[71].airtime.getTime()).to.equal(new Date(2014,3,15, 16,46).getTime());
        expect(newPlaylist[34].airtime.getTime()).to.equal(new Date(2014,3,15, 14,43).getTime());
        expect(newPlaylist[35].airtime.getTime()).to.equal(new Date(2014,3,15, 14,46).getTime());
        done();
      });
    });
  });

  xit('extends the playlist if a commercial leads in', function (done) {
  });

  after(function (done) {
    tk.reset();
    done();
  });
});