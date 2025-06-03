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
    // Log the request for debugging
    console.log('Upload request body:', req.body);
    console.log('Upload request file:', req.file);

    // Validate file presence
    if (!req.file) {
      return res.status(400).json({ 
        message: 'No file uploaded',
        details: 'Please ensure you are sending a file in the request'
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        message: 'Invalid file type',
        details: `Allowed types are: ${allowedTypes.join(', ')}`
      });
    }

    // Create media document
    const media = new Media({
      title: req.body.title || req.file.originalname,
      description: req.body.description || '',
      type: req.file.mimetype.startsWith('image/') ? 'image' : 'video',
      path: req.file.key,
      size: req.file.size,
      mimeType: req.file.mimetype
    });

    // Save to database
    await media.save();

    // Return response with full URL
    const mediaWithUrl = {
      ...media.toObject(),
      url: `https://s3.ap-south-1.amazonaws.com/bhartiallmedia/${media.path}`
    };

    res.status(201).json({
      message: 'Media uploaded successfully',
      media: mediaWithUrl
    });

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