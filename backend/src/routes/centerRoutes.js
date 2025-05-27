const express = require('express');
const router = express.Router();
const centerController = require('../controllers/centerController');
const upload = require('../middleware/upload');

// Configure multer for multiple file uploads
const uploadFields = upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'beneficiaryImages', maxCount: 10 }
]);

// List all centers
router.get('/', centerController.getAllCenters);
// Get single center
router.get('/:id', centerController.getCenter);
// Create center
router.post('/', uploadFields, centerController.createCenter);
// Update center
router.put('/:id', uploadFields, centerController.updateCenter);
// Delete center
router.delete('/:id', centerController.deleteCenter);

// Media APIs (for a center)
router.post('/:id/media', centerController.addMedia); // Add media to center
router.delete('/:id/media/:mediaId', centerController.deleteMedia); // Delete media from center

module.exports = router; 