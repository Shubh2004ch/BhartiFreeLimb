const Review = require('../models/Review');

// List all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create review (with optional image upload)
exports.createReview = async (req, res) => {
  try {
    
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);
    console.log(req);
    const { name, text, rating } = req.body;

    console.log(req.body);
    const review = new Review({
      name,
      text,
      rating: Number(rating),
      imagePath: req.file ? `uploads/${req.file.filename}` : undefined
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 