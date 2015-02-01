var db = require('../db');
var timestamps = require('mongoose-timestamp');
var moment = require('moment');
moment().format();

var rotationItemSchema = db.Schema({
  _station:             { type: db.Schema.ObjectId, ref: 'Song' },
  _song:                { type: db.Schema.ObjectId, ref: 'Station' },
  bin:                  { type: String },
  weight:               { type: Number },
  assignedAt:           { type: Date },
  history: [
              { 
                bin:        { type: String}, 
                weight:       { type: Number},
                startDate:    { type: Date},
                assignedAt:   { type: Date} 
              }
            ]
});

rotationItemSchema.statics.update = function (attrs, cb) {
  // if a new value is passed
  if (attrs.currentWeight != this.currentWeight) {
    
    this.history.push({ bin: this.currentBin,
                      weight: this.currentWeight,
                      assignedAt: this.assignedAt });
    this.assignedAt = moment.utc();
    this.weight = attrs.currentWeight;
    this.bin = attrs.currentBin || this.currentBin;
    this.save(cb);
  } else {
    if(cb) {
      cb();
    }
  }
}

rotationItemSchema.plugin(timestamps);
var RotationItem = db.model('RotationItem', rotationItemSchema);
module.exports = RotationItem;