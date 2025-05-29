const Media = require('../models/Media');
const path = require('path');

// List all media
exports.getAllMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ uploadDate: -1 });
    // Transform the media objects to include full S3 URLs
    const mediaWithUrls = media.map(item => ({
      ...item.toObject(),
      url: `https://s3.ap-south-1.amazonaws.com/bhartiallmedia/${item.path}`
    }));
    res.json(mediaWithUrls);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ 
      message: 'Error fetching media',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
      path: req.file.key,
    });
    await media.save();

    // Include the full S3 URL in the response
    const mediaWithUrl = {
      ...media.toObject(),
      url: `https://s3.ap-south-1.amazonaws.com/bhartiallmedia/${media.path}`
    };
    res.status(201).json(mediaWithUrl);
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ 
      message: 'Error uploading media',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
    console.error('Error deleting media:', error);
    res.status(500).json({ 
      message: 'Error deleting media',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 