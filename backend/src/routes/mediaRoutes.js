const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const upload = require('../middleware/upload');

// Upload media
router.post('/upload', upload.single('media'), mediaController.uploadMedia);

// Get all media
router.get('/', mediaController.getAllMedia);

// Delete media
router.delete('/:id', mediaController.deleteMedia);

module.exports = router; 