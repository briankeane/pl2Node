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
      Song.findOne({ artist: 'Rachel Loy' }, function (err, gottenUser) {
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

  it ('can be retrieved by id', function (done) {
    song.save(function (err, savedSong) {
      Song.findById(savedSong.id, function (err, gottenSong) {
        expect(err).to.equal(null);
        expect(gottenSong.artist).to.equal('Rachel Loy');
        done();
      });
    });
  });

  it ('can be updated', function (done) {
      song.save(function (err, savedSong) {
      Song.findByIdAndUpdate(savedSong.id, { $set: { artist: 'Adam Hood',
                                                title: 'He Did',
                                                album: 'Welcome to the Big World',
                                                duration: 1990,
                                                key: 'ThisIsADifferentKey',
                                                echonestId: 'anotherEchonestId' } }, function (err, updatedSong) {
        expect(err).to.equal(null);
        expect(updatedSong.artist).to.equal('Adam Hood');
        expect(updatedSong.title).to.equal('He Did');
        expect(updatedSong.album).to.equal('Welcome to the Big World');
        expect(updatedSong.duration).to.equal(1990);
        expect(updatedSong.key).to.equal('ThisIsADifferentKey');
        expect(updatedSong.echonestId).to.equal('anotherEchonestId');
        done();
      });
    });
  });
  
  xit ('can be deleted', function (done) {
  });
  xit ('finds out if a song exists', function (done) {

  });
  describe ('song retrieval tests', function (done) {

    xit ('gets a list of songs by title', function (done) {

    });
    xit ('gets a list of songs by artist', function (done) {

    });
    xit ('gets a list of songs by keywords', function (done) {

    });
    xit ('gets a list of songs by artist and title', function (done) {

    });
    xit ('gets a song by its echonest_id', function (done) {

    });
    xit ('gets a song by its key', function (done) {

    });
    xit ('returns a list of all songs in the database in the proper order', function (done) {
      
    });
  });



});
