const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/public/mediaController');
const upload = require('../middleware/upload');

// Configure upload middleware
const uploadMiddleware = upload.fields([
  { name: 'media', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]);

// Upload media - support both paths
router.post('/', uploadMiddleware, mediaController.uploadMedia);
router.post('/upload', uploadMiddleware, mediaController.uploadMedia);

// Get all media
router.get('/', mediaController.getAllMedia);

// Delete media
router.delete('/:id', mediaController.deleteMedia);

module.exports = router; 