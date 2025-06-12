const express = require('express');
const router = express.Router();
const foodStallController = require('../controllers/foodStallController');
const { upload, handleMulterError } = require('../config/s3');

// Debug middleware for file uploads
const debugUpload = (req, res, next) => {
  console.log('File upload request received');
  console.log('Request body:', req.body);
  console.log('Request files:', req.files);
  next();
};

// Configure multer for multiple images upload
const uploadImages = upload.array('images', 10);

router.get('/', foodStallController.getAllFoodStalls);
router.get('/:id', foodStallController.getFoodStallById);
router.post('/', upload.single('image'), foodStallController.createFoodStall);
router.put('/:id', upload.single('image'), foodStallController.updateFoodStall);
router.delete('/:id', foodStallController.deleteFoodStall);

// Upload multiple images to food stall
router.post('/:id/images', 
  debugUpload,
  (req, res, next) => {
    uploadImages(req, res, (err) => {
      if (err) {
        console.error('File upload error:', err);
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },
  foodStallController.uploadImages
);

module.exports = router; 