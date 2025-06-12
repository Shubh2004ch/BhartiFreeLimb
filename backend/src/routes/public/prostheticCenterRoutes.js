const express = require('express');
const router = express.Router();
const prostheticCenterController = require('../controllers/prostheticCenterController');
const { uploadMiddleware } = require('../middleware/upload');

// Debug middleware for file uploads
const debugUpload = (req, res, next) => {
  console.log('Files:', req.files);
  console.log('Body:', req.body);
  next();
};

// Configure multer for multiple image uploads
const uploadImages = uploadMiddleware.array('images', 10); // Allow up to 10 images

// Routes
router.get('/', prostheticCenterController.getAllCenters);
router.get('/:id', prostheticCenterController.getCenterById);
router.post('/', uploadMiddleware.fields([
  { name: 'hero', maxCount: 1 },
  { name: 'beneficiaries', maxCount: 10 }
]), prostheticCenterController.createCenter);
router.put('/:id', uploadMiddleware.fields([
  { name: 'hero', maxCount: 1 },
  { name: 'beneficiaries', maxCount: 10 }
]), prostheticCenterController.updateCenter);
router.delete('/:id', prostheticCenterController.deleteCenter);

// New route for uploading multiple images
router.post('/:id/images', debugUpload, uploadImages, prostheticCenterController.uploadImages);

module.exports = router; 