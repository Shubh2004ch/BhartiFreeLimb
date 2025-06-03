const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const upload = require('../middleware/upload');

// Upload media - supporting both 'media' and 'file' field names
router.post('/upload', upload.fields([
  { name: 'media', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]), mediaController.uploadMedia);

// Get all media
router.get('/', mediaController.getAllMedia);

// Delete media
router.delete('/:id', mediaController.deleteMedia);

module.exports = router; 