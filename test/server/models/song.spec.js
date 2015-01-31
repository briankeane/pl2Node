var db = require('../../../db');
var User = require('../../../models/user');
var Song = require('../../../models/song');
var expect = require('chai').expect;
var async = require('async');

describe('a song', function () {
  var song;

  beforeEach(function (done) {
    Song.remove({}, function (err) {
      song = new Song({ artist: 'Rachel Loy',
                        title: 'Stepladder',
                        album: 'Broken Machine',
                        duration: 180000,
                        key: 'ThisIsAKey.mp3',
                        echonestId: 'ECHONEST_ID' });
      debugger;
      done();
    });
  });

  it ('can be created but not saved', function (done) {
      expect(song.artist).to.equal('Rachel Loy');
      expect(song.title).to.equal('Stepladder');
      expect(song.album).to.equal('Broken Machine');
      expect(song.duration).to.equal(180000);
      expect(song.key).to.equal('ThisIsAKey.mp3');
      expect(song.echonestId).to.equal('ECHONEST_ID');
      done();
    });

  it ('persists a song', function (done) {
    song.save(function (err, user) {
      expect(err).to.equal(null);
      Song.findOne({ artist: 'BrianKeaneTunes' }, function (err, gottenUser) {
        expect(err).to.equal(null);
        expect(song.artist).to.equal('Rachel Loy');
        expect(song.title).to.equal('Stepladder');
        expect(song.album).to.equal('Broken Machine');
        expect(song.duration).to.equal(180000);
        expect(song.key).to.equal('ThisIsAKey.mp3');
        expect(song.echonestId).to.equal('ECHONEST_ID');
        done();
      });
    });
  });
});
