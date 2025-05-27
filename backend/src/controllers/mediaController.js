const Media = require('../models/Media');
const path = require('path');

// List all media
exports.getAllMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ uploadDate: -1 });
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload media (image/video)
exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const media = new Media({
      title: req.body.title || req.file.originalname,
      type: req.file.mimetype.startsWith('image/') ? 'image' : 'video',
      path: 'uploads/' + req.file.filename,
    });
    await media.save();
    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete media
exports.deleteMedia = async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }
    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 