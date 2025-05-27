const express = require('express');
const router = express.Router();
const sleepingBagController = require('../controllers/sleepingBagController');
const upload = require('../middleware/upload');

router.get('/', sleepingBagController.getAllSleepingBags);
router.post('/', upload.single('image'), sleepingBagController.createSleepingBag);
router.put('/:id', upload.single('image'), sleepingBagController.updateSleepingBag);
router.delete('/:id', sleepingBagController.deleteSleepingBag);

module.exports = router; 