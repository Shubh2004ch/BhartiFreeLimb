const express = require('express');
const router = express.Router();
const shelterController = require('../controllers/shelterController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', shelterController.getAllShelters);
router.get('/:id', shelterController.getShelter);

// Protected routes (admin only)
router.post('/', auth, upload.array('images', 5), shelterController.createShelter);
router.put('/:id', auth, upload.array('images', 5), shelterController.updateShelter);
router.delete('/:id', auth, shelterController.deleteShelter);

module.exports = router; 