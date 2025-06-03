const express = require('express');
const router = express.Router();
const sleepingBagController = require('../controllers/sleepingBagController');
const uploadMiddleware = require('../middleware/upload');

// Debug middleware
const debugRequest = (req, res, next) => {
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('Request files:', req.files);
  console.log('Request file:', req.file);
  next();
};

router.get('/', sleepingBagController.getAllSleepingBags);
router.post('/', debugRequest, uploadMiddleware.single('file'), sleepingBagController.createSleepingBag);
router.put('/:id', debugRequest, uploadMiddleware.single('file'), sleepingBagController.updateSleepingBag);
router.delete('/:id', sleepingBagController.deleteSleepingBag);

module.exports = router; 