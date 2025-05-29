const SuccessStory = require('../models/SuccessStory');

// List all success stories
exports.getAllStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create story (with file upload)
exports.createStory = async (req, res) => {
  try {
    const { name, role, quote, mediaType } = req.body;
    const story = new SuccessStory({
      name,
      role,
      quote,
      mediaType,
      mediaPath: req.file ? req.file.key : undefined,
      thumbnailPath: req.body.thumbnailPath // for video, optional
    });
    await story.save();
    res.status(201).json(story);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete story
exports.deleteStory = async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndDelete(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 