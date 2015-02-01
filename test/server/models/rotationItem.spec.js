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

      station = new Station({ secsOfCommercialPerHour: 3 });
      
      SpecHelper.saveAll([song, station], function (err, moreResults) {
        rotationItem = new RotationItem({ _song: song._id,
                                          _station: station._id,
                                          bin: 'trash',
                                          weight: 45 });
        rotationItem.save(function (err) {
          done();
        }); 
      });
    });
  });

  it("stores a song's station, song, current weight and bin", function (done) {
    expect(rotationItem.bin).to.equal('trash');
    expect(rotationItem.weight).to.equal(45);
    //expect(rotationItem._station).to.equal(station.id);
    RotationItem.findByIdAndPopulate(rotationItem.id, function (err, item) {
      expect(item._song.title).to.equal('Stepladder');
      expect(item._song.id).to.equal(song.id);
      expect(item._station.id).to.equal(station.id);
      done();   
    });
  });

  it("can updated weight and log it's own history", function (done) {
    var oldDate = rotationItem.assignedAt;
    rotationItem.updateWeight(55, function (err, updatedItem) {
      expect(err).to.equal(null);
      expect(updatedItem.history[0].weight).to.equal(45);
      expect(updatedItem.weight).to.equal(55);
      expect(updatedItem.bin).to.equal('trash');
      expect(updatedItem.history[0].bin).to.equal('trash');
      expect(updatedItem.history[0].assignedAt.getTime()).to.equal(oldDate.getTime());
      expect(updatedItem.assignedAt.getTime()).to.be.above(oldDate.getTime());
      done();
    });
  });

  it("can update bin and log it's own history", function (done) {
    var oldDate = rotationItem.assignedAt;
    rotationItem.updateBin('recycle', function (err, updatedItem) {
      expect(updatedItem.weight).to.equal(45);
      expect(updatedItem.bin).to.equal('recycle');
      expect(updatedItem.history[0].weight).to.equal(45);
      expect(updatedItem.history[0].bin).to.equal('trash');
      expect(updatedItem.history[0].assignedAt.getTime()).to.equal(oldDate.getTime());
      expect(updatedItem.assignedAt.getTime()).to.be.above(oldDate.getTime());
      done();
    });
  });

    it("updates both bin and weight and logs it's own history", function (done) {
    var oldDate = rotationItem.assignedAt;
    rotationItem.updateWeightAndBin(55, 'recycle', function (err, updatedItem) {
      expect(updatedItem.weight).to.equal(55);
      expect(updatedItem.bin).to.equal('recycle');
      expect(updatedItem.history[0].bin).to.equal('trash');
      expect(updatedItem.history[0].weight).to.equal(45);
      expect(updatedItem.history[0].assignedAt.getTime()).to.equal(oldDate.getTime());
      expect(updatedItem.assignedAt.getTime()).to.be.above(oldDate.getTime());
      done();
    });
  });
  xit("does not update if ")
});