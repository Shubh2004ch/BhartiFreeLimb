const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: 'N/A',
    trim: true
  },
  type: { 
    type: String, 
    enum: ['image', 'video'], 
    required: true 
  },
  path: { 
    type: String, 
    required: true 
  },
  uploadDate: { 
    type: Date, 
    default: Date.now 
  },
  metadata: {
    size: Number,
    mimetype: String,
    originalName: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full URL
mediaSchema.virtual('url').get(function() {
  if (this.path.startsWith('http')) {
    return this.path;
  }
  return `https://s3.ap-south-1.amazonaws.com/bhartiallmedia/${this.path}`;
});

module.exports = mongoose.model('Media', mediaSchema); 