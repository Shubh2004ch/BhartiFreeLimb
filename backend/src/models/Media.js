const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: String,
  type: { type: String, enum: ['image', 'video'], required: true },
  path: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Media', mediaSchema); 