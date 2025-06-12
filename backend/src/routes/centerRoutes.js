const express = require('express');
const router = express.Router();
const centerController = require('../controllers/public/centerController');
const { upload, handleMulterError } = require('../config/s3');

// Configure multer for multiple file uploads
const uploadFields = upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'beneficiaryImages', maxCount: 10 }
]);

// Configure multer for multiple images upload
const uploadImages = upload.array('images', 10);

// List all centers
router.get('/', centerController.getAllCenters);
// Get single center
router.get('/:id', centerController.getCenter);
// Create center with error handling
router.post('/', 
  (req, res, next) => {
    uploadFields(req, res, (err) => {
      if (err) {
        console.error('File upload error:', err);
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },
  centerController.createCenter
);
// Update center with error handling
router.put('/:id',
  (req, res, next) => {
    uploadFields(req, res, (err) => {
      if (err) {
        console.error('File upload error:', err);
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },
  centerController.updateCenter
);
// Delete center
router.delete('/:id', centerController.deleteCenter);

// Upload multiple images to center
router.post('/:id/images', 
  (req, res, next) => {
    uploadImages(req, res, (err) => {
      if (err) {
        console.error('File upload error:', err);
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },
  centerController.uploadImages
);

// Media APIs (for a center)
router.post('/:id/media', centerController.addMedia); // Add media to center
router.delete('/:id/media/:mediaId', centerController.deleteMedia); // Delete media from center

module.exports = router; 