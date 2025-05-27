const express = require('express');
const router = express.Router();
const waterPondController = require('../controllers/waterPondController');
const upload = require('../middleware/upload');

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

module.exports = router; 