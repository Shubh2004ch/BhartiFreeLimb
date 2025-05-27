const express = require('express');
const router = express.Router();
const foodStallController = require('../controllers/foodStallController');
const upload = require('../middleware/upload');

router.get('/', foodStallController.getAllFoodStalls);
router.post('/', upload.single('image'), foodStallController.createFoodStall);
router.put('/:id', upload.single('image'), foodStallController.updateFoodStall);
router.delete('/:id', foodStallController.deleteFoodStall);

module.exports = router; 