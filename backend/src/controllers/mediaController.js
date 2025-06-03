const Media = require('../models/Media');
const path = require('path');

// List all media
exports.getAllMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ uploadDate: -1 });
    // Transform the media objects to include full S3 URLs
    const mediaWithUrls = media.map(item => ({
      ...item.toObject(),
      url: item.path.startsWith('http') ? item.path : `https://s3.ap-south-1.amazonaws.com/bhartiallmedia/${item.path}`
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
    console.log('Uploading media...');
    console.log('Request body:', req.body);
    console.log('File:', req.file);

    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ 
        message: 'No file uploaded',
        details: 'Please provide a file in the request' 
      });
    }

    // Create media document
    const media = new Media({
      title: req.body.title || path.parse(req.file.originalname).name,
      description: req.body.description || 'N/A',
      type: req.file.mimetype.startsWith('image/') ? 'image' : 'video',
      path: req.file.location || req.file.path, // Use S3 location if available
      uploadDate: new Date(),
      metadata: {
        size: req.file.size,
        mimetype: req.file.mimetype,
        originalName: req.file.originalname
      }
    });

    // Save to database
    await media.save();
    console.log('Media saved successfully:', media._id);

    // Prepare response
    const mediaResponse = {
      ...media.toObject(),
      url: media.path.startsWith('http') ? media.path : `https://s3.ap-south-1.amazonaws.com/bhartiallmedia/${media.path}`
    };

    res.status(201).json({
      message: 'Media uploaded successfully',
      media: mediaResponse
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ 
      message: 'Error uploading media',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      details: error.stack
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
    res.json({ 
      message: 'Media deleted successfully',
      deletedMedia: media
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ 
      message: 'Error deleting media',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 