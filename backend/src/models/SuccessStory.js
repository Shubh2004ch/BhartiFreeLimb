const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  quote: String,
  mediaType: { type: String, enum: ['image', 'video'], required: true },
  mediaPath: { type: String, required: true },
  thumbnailPath: String, // for video
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SuccessStory', successStorySchema); 