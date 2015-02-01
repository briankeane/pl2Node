var db = require('../../../db');
var SpecHelper = require('../specHelper');
var Song = require('../../../models/song');
var Station = require('../../../models/station');
var RotationItem = require('../../../models/rotationItem');
var expect = require('chai').expect;
var async = require('async');


describe('a rotationItem', function () {
  var rotationItem;
  var song;
  var station;

  beforeEach(function (done) {
    db.connection.db.dropDatabase(function() {
      song = new Song({ artist: 'Rachel Loy',
                        title: 'Stepladder',
                        album: 'Broken Machine',
                        duration: 180000,
                        key: 'ThisIsAKey.mp3',
                        echonestId: 'ECHONEST_ID' });

      station = new Station({ _user: 1, secsOfCommercialPerHour: 3 });
      
      SpecHelper.saveAll([song, station], function (err, moreResults) {
        rotationItem = new RotationItem({ _song: song.id,
                                        _station: station.id,
                                        currentBin: 'trash',
                                        currentWeight: 45 });
        rotationItem.save(function (err) {
          done();
        }); 
      });
    });
  });

  it("stores a song's station, song, current weight and bin", function (done) {
    expect(rotationItem.currentBin).to.equal('trash');
    expect(rotationItem.currentWeight).to.equal(45);
    RotationItem.findByIdAndPopulate(rotationItem, function (item) {
      expect(item.station.id).to.equal(station.id);
      expect(item.song.id).to.equal(song.id);
      expect(item.song.title).to.equal('stepladder');
      done();   
    });
  });

  xit("stores its station", function (done) {

  });

  xit("stores its song", function (done) {

  });

  xit("can be updated and logs it's own history", function (done) {

  });

  xit("can be updated with only the weight")

  xit("does not update if ")
});