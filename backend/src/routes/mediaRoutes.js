const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const { upload, handleMulterError } = require('../config/s3');

// Upload media (both at /upload and root path)
router.post('/', 
  (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        console.error('File upload error:', err);
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },
  mediaController.uploadMedia
);

router.post('/upload', 
  (req, res, next) => {
    upload.single('media')(req, res, (err) => {
      if (err) {
        console.error('File upload error:', err);
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },
  mediaController.uploadMedia
);

// Get all media
router.get('/', mediaController.getAllMedia);

// Delete media
router.delete('/:id', mediaController.deleteMedia);

module.exports = router; 