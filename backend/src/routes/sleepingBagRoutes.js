const express = require('express');
const router = express.Router();
const sleepingBagController = require('../controllers/sleepingBagController');
const upload = require('../middleware/upload');

// Debug middleware
const debugRequest = (req, res, next) => {
  console.log('Request body:', req.body);
  console.log('Request files:', req.files);
  console.log('Request file:', req.file);
  next();
};

router.get('/', sleepingBagController.getAllSleepingBags);
router.post('/', debugRequest, upload.single('file'), sleepingBagController.createSleepingBag);
router.put('/:id', debugRequest, upload.single('file'), sleepingBagController.updateSleepingBag);
router.delete('/:id', sleepingBagController.deleteSleepingBag);

module.exports = router; 