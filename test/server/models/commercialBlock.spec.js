process.env.NODE_ENV="test";
var db = require('../../../db');
var CommercialBlock = require('../../../models/commercialBlock');
var expect = require('chai').expect;
var specHelper = require('../specHelper');

describe('a commercialBlock', function (done) { 
  var commercialBlock;

  beforeEach(function (done) {
    specHelper.clearDatabase(function() {
      commercialBlock = new CommercialBlock({ duration: 360 });

      commercialBlock.save(function (err, savedCommercialBlock) {
        done();
      });
    });
  });

  it("is created with id, key, duration, and populatable station", function (done) {
    CommercialBlock.findById(commercialBlock.id)
    .exec(function (err, foundCommercialBlock) {
      expect(foundCommercialBlock.duration).to.equal(360);
      done();
    });
  });

  it("can be updated", function (done) {
    CommercialBlock.findByIdAndUpdate(commercialBlock.id, { $set: { duration: 200 } 
    }, function (err, updatedCommercialBlock) {
      expect(updatedCommercialBlock.duration).to.equal(200);
      done();
    });
  });
});