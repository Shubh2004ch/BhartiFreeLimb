const express = require('express');
const router = express.Router();
const successStoryController = require('../../controllers/public/successStoryController');
const upload = require('../../middleware/upload');

// List all success stories
router.get('/', successStoryController.getAllStories);
// Create story (with file upload)
router.post('/', upload.single('media'), successStoryController.createStory);
// Delete story
router.delete('/:id', successStoryController.deleteStory);

module.exports = router; 