var db = require('../db');
var timestamps = require('mongoose-timestamp');
var moment = require('moment');
var Song = require('./song');
var Station = require('./station');

moment().format();

var rotationItemSchema = db.Schema({
  _station:             { type: db.Schema.ObjectId, ref: 'Station' },
  _song:                { type: db.Schema.ObjectId, ref: 'Song' },
  bin:                  { type: String },
  weight:               { type: Number },
  assignedAt:           { type: Date, default: moment.utc() },
  history: [
              { 
                bin:        { type: String}, 
                weight:       { type: Number},
                assignedAt:   { type: Date} 
              }
            ]
});

rotationItemSchema.statics.update = function (attrs, callback) {
  // if a new value is passed
  if (attrs.currentWeight != this.currentWeight) {
    
    this.history.push({ bin: this.currentBin,
                      weight: this.currentWeight,
                      assignedAt: this.assignedAt });
    this.assignedAt = moment.utc();
    this.weight = attrs.currentWeight;
    this.bin = attrs.currentBin || this.currentBin;
    this.save(callback);
  } else {
    if(callback) {
      callback();
    }
  }
}

rotationItemSchema.statics.findByIdAndPopulate = function (id, callback) {
  RotationItem
  .findById(id)
  .populate('_station _song')
  .exec(callback);
};

rotationItemSchema.methods.updateWeight = function (weight, callback) {
  if (weight == this.weight) {
    callback(null, this);
  } else {
    // store the old values in history array
    this.history.push({ bin: this.bin,
                        weight: this.weight,
                        assignedAt: this.assignedAt});

    // update new values
    this.weight = weight;
    this.assignedAt = moment.utc();
    this.save(callback);
  }
}

rotationItemSchema.methods.updateBin = function (bin, callback) {
  callback();
}

rotationItemSchema.methods.updateWeightAndBin = function (weight, bin, callback) {
  callback();
}

rotationItemSchema.plugin(timestamps);
var RotationItem = db.model('RotationItem', rotationItemSchema);
module.exports = RotationItem;