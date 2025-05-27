const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  imagePath: String,
  contactNumber: String,
  operatingHours: String,
  services: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Clinic', clinicSchema); 