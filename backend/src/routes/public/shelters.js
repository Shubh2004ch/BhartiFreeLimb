const express = require('express');
const router = express.Router();
const shelterController = require('../controllers/shelterController');
const auth = require('../middleware/auth');
const uploadMiddleware = require('../middleware/upload');

// Debug middleware for file uploads
const debugUpload = (req, res, next) => {
  console.log('Files:', req.files);
  console.log('Body:', req.body);
  next();
};

// Public routes
router.get('/', shelterController.getAllShelters);
router.get('/:id', shelterController.getShelter);

// Protected routes (admin only)
router.post('/', 
  auth, 
  debugUpload,
  uploadMiddleware.single('imagePath'),
  shelterController.createShelter
);

router.put('/:id', 
  auth, 
  debugUpload,
  uploadMiddleware.single('imagePath'),
  shelterController.updateShelter
);

router.delete('/:id', auth, shelterController.deleteShelter);

// Upload multiple images to shelter
router.post('/:id/images', 
  auth,
  debugUpload,
  uploadMiddleware.array('images', 10),
  shelterController.uploadImages
);

module.exports = router; 