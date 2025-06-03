const express = require('express');
const router = express.Router();
const foodStallController = require('../controllers/foodStallController');
const upload = require('../middleware/upload');

// Debug middleware for file uploads
const debugUpload = (req, res, next) => {
  console.log('File upload request received');
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  next();
};

router.get('/', foodStallController.getAllFoodStalls);
router.post('/', upload.single('image'), foodStallController.createFoodStall);
router.put('/:id', upload.single('image'), foodStallController.updateFoodStall);
router.delete('/:id', foodStallController.deleteFoodStall);

module.exports = router; 