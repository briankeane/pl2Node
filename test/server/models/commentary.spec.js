var db = require('../../../db');
var Station = require('../../../models/station');
var Commentary = require('../../../models/commentary');
var expect = require('chai').expect;
var async = require('async');

describe('a commentary', function (done) { 
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

        commentary.save(function (err, savedCommentary) {
          done();
        });
      });
    });
  });

  it("is created with id, key, duration, and populatable station", function (done) {
    Commentary.findById(commentary.id)
    .populate('_station')
    .exec(function (err, foundCommentary) {
      expect(foundCommentary.key).to.equal('commentarykey.mp3');
      expect(foundCommentary.duration).to.equal(100);
      expect(foundCommentary._station.secsOfCommercialPerHour).to.equal(180);
      done();
    });
  });

  it("can be updated", function (done) {
    Commentary.findByIdAndUpdate(commentary.id, { $set: { key: 'otherkey',
                                                          duration: 200 } 
    }, function (err, updatedCommentary) {
      expect(updatedCommentary.key).to.equal('otherkey');
      expect(updatedCommentary.duration).to.equal(200);
      done();
    });
  });
});