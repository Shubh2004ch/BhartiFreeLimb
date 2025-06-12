const mongoose = require('mongoose');

const sleepingBagSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  imagePath: String,
  contactNumber: String,
  availability: { type: Boolean, default: true },
  quantity: { type: Number, default: 0 },
  images: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('SleepingBag', sleepingBagSchema); 