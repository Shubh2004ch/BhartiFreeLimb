const mongoose = require('mongoose');

const foodStallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  imagePath: String,
  contactNumber: String,
  operatingHours: String,
  images: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('FoodStall', foodStallSchema); 