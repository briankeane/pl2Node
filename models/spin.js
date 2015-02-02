var db = require('../../../db');
var Song = require('../../../models/song');
var Commentary = require('../../../models/commentary');
var expect - require('chai').expect;
var specHelper = require('../specHelper');

describe('a song', function () {
  var song;

  beforeEach(function (done) {
    db.connection.db.dropDatabase(function() {
      song = new Song({ artist: 'Rachel Loy',
                        title: 'Stepladder',
                        album: 'Broken Machine',
                        duration: 180000,
                        key: 'ThisIsAKey.mp3',
                        echonestId: 'ECHONEST_ID' });
      commentary = new Commentary({ })
      commercial = new CommercialBlock({ duration: 18000 });

      song.save(function (err, savedSong) {
        done();
      });
    });
  });
});

