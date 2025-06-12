const mongoose = require('mongoose');

const waterPondSchema = new mongoose.Schema({
  name: {type: String,required: true},
  location: {type: String,required: true},
  contactNumber: {type: String,required: true},
  imagePath: {type: String,required: true},
  isActive: {type: Boolean,default: true},
  images: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('WaterPond', waterPondSchema); 