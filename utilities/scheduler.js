var db = require('../db');
var Station = require('../models/station');
var audioBlockSchema = require('../models/audioBlockSchema');
var AudioBlock = db.model('AudioBlock', audioBlockSchema);
var LogEntry = require('../models/logEntry');
var Commentary = require('../models/commentary');
var RotationItem = require('../models/rotationItem');
var Song = require('../models/song');
var Spin = require('../models/spin');
var User = require('../models/user');
var moment = require('moment-timezone');
var _ = require('lodash');
var Helper = require('./helper');



function Scheduler() {
  var self = this;
  var sampleArray;
  var lastAccuratePlaylistPosition;
  var maxPosition;
  var timeTracker;
  var recentlyPlayedSongs;

  this.generatePlaylist = function (attrs, callback) {
    
    // all times utc
    moment().utc().format();

    // unpack attrs
    var station = attrs.station;
    if (attrs.playlistEndTime) {
      var playlistEndTime = moment(playlistEndTime);
    } else {
      var playlistEndTime = moment().add(2, 'hours');
    }
    var playlistEndTime = attrs.playlistEndTime || moment().add(2,'hours');
    
    // grab playlist and logs
    LogEntry.getRecent({ _station: station.id,
                         count: 20 }, function (err, currentLogEntries) {

      Spin.getFullPlaylist(station.id, function (err, currentPlaylist) {

        // create the sample array to draw on
        sampleArray = [];
        RotationItem.findAllForStation(station.id, function (err, rotationItems) {
          rotationItems.forEach(function (rotationItem) {
            if (rotationItem.bin === 'inRotation') {
              for(var i=0;i<rotationItem.weight; i++) {
                sampleArray.push(rotationItem._song);
              }
            }
          });

          // if the log exists but there's no playlist
          if ((!currentPlaylist.length) && (currentLogEntries.length)) {

            // give it 1 spin to start from
            lastAccuratePlaylistPosition = currentLogEntries[0].playlistPosition + 1
            var spin = new Spin({ _station: station.id,
                                  _audioBlock: _.sample(sampleArray),
                                  playlistPosition: lastAccuratePlaylistPosition,
                                  airtime: currentLogEntries[0].endTime });
            currentPlaylist.push(spin);
          }

          // set maxPosition and timeTracker values
          if (currentPlaylist.length == 0) {
            maxPosition = 0;
            timeTracker = moment();
          } else {
            var lastIndex = currentPlaylist.length - 1;
            maxPosition = currentPlaylist[lastIndex].playlistPosition;
            timeTracker = moment(currentPlaylist[lastIndex].endTime);
            
            if (currentPlaylist[lastIndex].commercialsFollow) {
              timeTracker.add(station.secsOfCommercialPerHour/2, 'seconds');
            }
          }

          // load recently played songs
          recentlyPlayedSongs = [];
          for (var i=0; i<currentPlaylist.length-1; i++) {
            recentlyPlayedSongs.push(currentPlaylist[i]._audioBlock);
          }

          // if (recentlyPlayedSongs.length < 20) {
          //   // add until there's 20 or the logEntries are all used
          //   var songsRemaining = Math.max(currentLogEntries.length-1, 20 - recentlyPlayedSongs.length);
          //   for (var i=songsRemaining; i>=0; i--) {
          //     recentlyPlayedSongs.push(currentLogEntries[i]._audioBlock);
          //   }
          // }

          var spins = [];

          while(timeTracker.isBefore(playlistEndTime)) {
            song = _.sample(sampleArray);

            // while the id is in the recentlyPlayedSongs array, pick another
            while(recentlyPlayedSongs.some(function (e) { return e.id == song.id; })) {
              song = _.sample(sampleArray);
            }

            recentlyPlayedSongs.push(song);

            // if recentlyPlayedSongs is at max size, delete the 1st song
            if ((recentlyPlayedSongs.length >= 20) || 
                                (recentlyPlayedSongs.length >= rotationItems.length-1)) {
              recentlyPlayedSongs.shift();
            }

            spin = new Spin({ _station: station.id,
                              _audioBlock: song.id,
                              playlistPosition: maxPosition += 1,
                              airtime: moment(timeTracker).toDate() });

            spins.push(spin);

            timeTracker = timeTracker.add(song.duration, 'ms');

           // eventually change to "if spin.commercialsFollow"
           if (Math.floor(spin.airtime.getTime()/1800000.0) != Math.floor(timeTracker.toDate().getTime()/1800000.0)) {
            timeTracker = timeTracker.add(station.secsOfCommercialPerHour/2, 'seconds');
           }
          }

          Helper.saveAll(spins, function (err, savedSpins) {
            station.lastAccuratePlaylistPosition = maxPosition;
            station.lastAccurateAirtime = moment(timeTracker).toDate();
            station.save(function (err, savedStation) {
              // if it's the first playlist, start the station
              if (currentLogEntries.length === 0) {
                var firstSpin = spins[0];
                var logEntry = new LogEntry({ _station: station.id,
                                              _audioBlock: firstSpin._audioBlock,
                                              playlistPosition: firstSpin.playlistPosition,
                                              airtime: firstSpin.airtime,
                                              durationOffset: firstSpin.durationOffset });
                logEntry.save(function (err, savedLogEntry) {
                  Spin.findById(firstSpin.id).remove(function (err, removedSpin) {
                    callback(null, station);
                    return;
                  });
                });
              } else {
                callback(null, station);
                return;
              }
            });
          });
        });
      });
    });
  };

  this.updateAirtimes = function (attrs, callback) {

    moment().utc().format();

    var station = attrs.station;
    var fullPlaylist;
    var finalLogEntry;
    var playlist;
    var lastAccuratePlaylistPosition;
    var timeTracker;

    // exit if playlist is already accurate
    if ( ((attrs.endTime) && (attrs.endTime < station.lastAccurateAirtime)) || 
                                       ((attrs.playlistPosition) && 
                           (attrs.playlistPosition < lastAccuratePlaylistPosition))) {
      callback(null, station);
      return;
    }

    Spin.getFullPlaylist(station.id, function (err, gottenPlaylist) {
      fullPlaylist = gottenPlaylist;
      
      // exit if there's no playlist
      if (!fullPlaylist.length) {
        callback(null, station);
        return;
      }

      // if the lastAccuratePosition is after the log, set it as the starting point
      LogEntry.getRecent({ _station: station.id, count:1 }, function (err, gottenLogEntry) {
        finalLogEntry = gottenLogEntry;
        // if the lastAccuratePosition is in the playlist, use it to start
        if ((station.lastAccuratePlaylistPosition) && (station.lastAccuratePlaylistPosition > finalLogEntry.playlistPosition)) {
          lastAccuratePlaylistPosition = station.lastAccuratePlaylistPosition;
        // otherwise use logentry
        } else {
          lastAccuratePlaylistPosition = finalLogEntry.playlistPosition;
        }

        Spin.getPartialPlaylist({ _station: station.id,
                                    startingPlaylistPosition: lastAccuratePlaylistPosition 
                                }, function (err, partialPlaylist) {
          
          playlist = partialPlaylist;

          // set timeTracker
          if (lastAccuratePlaylistPosition == 0) {
            if (finalLogEntry.commercialsFollow) {
              timeTracker = moment(finalLogEntry.endTime + station.secsOfCommercialPerHour/2);
            } else {
              timeTracker = moment(finalLogEntry.endTime);
            };

          } else {
            timeTracker = moment(playlist[0].startTime);
          }


          var i=0;
          for (i=0; i<playlist.length; i++) {
            playlist[i].airtime = moment(timeTracker).toDate();
            lastAccuratePlaylistPosition = playlist[i].playlistPosition;

            timeTracker.add(playlist[i].duration, 'ms');

            // add commercial time if necessary
            if (playlist[i].commercialsFollow) {
              timeTracker.add(station.secsOfCommercialPerHour/2, 'seconds');
            }

            // break out if past stop time
            if (attrs.endTime && (timeTracker > attrs.endTime)) {
              break;
            }

            // break out if past endingPlaylistPosition
            if (attrs.endingPlaylistPosition && (playlist[i].playlistPosition >= attrs.endingPlaylistPosition)) {
              break;
            }
          }


          // push all to be updated in db into an array
          var toSave = playlist.slice(0,i);
          toSave.push(station);

          // update
          Helper.saveAll(playlist, function (err, savedPlaylist) {
            callback(null, station);
            return;
          });
        });
      });
    });
  };
}

module.exports = new Scheduler();