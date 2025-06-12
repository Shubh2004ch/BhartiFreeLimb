const express = require('express');
const router = express.Router();
const waterPondController = require('../../controllers/public/waterPondController');
const upload = require('../../middleware/upload');

// Configure multer for multiple images upload
const uploadImages = upload.array('images', 10);

// Get all active water ponds
router.get('/', waterPondController.getAllWaterPonds);

// Get a specific water pond
router.get('/:id', waterPondController.getWaterPondById);

// Create a new water pond
router.post('/', upload.single('image'), waterPondController.createWaterPond);

// Update a water pond
router.put('/:id', upload.single('image'), waterPondController.updateWaterPond);

// Delete a water pond (soft delete)
router.delete('/:id', waterPondController.deleteWaterPond);

// Upload multiple images to water pond
router.post('/:id/images', 
  (req, res, next) => {
    uploadImages(req, res, (err) => {
      if (err) {
        console.error('File upload error:', err);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  waterPondController.uploadImages
);

module.exports = router; 