const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const uploadMiddleware = require('../middleware/upload');

// Upload media - using single file upload with proper middleware chain
router.post('/upload', 
  uploadMiddleware.single('file'), // Changed from 'media' to 'file' to match frontend
  mediaController.uploadMedia
);

// Get all media
router.get('/', mediaController.getAllMedia);

// Delete media
router.delete('/:id', mediaController.deleteMedia);

module.exports = router; 