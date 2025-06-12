const express = require('express');
const router = express.Router();
const reviewController = require('../../controllers/reviewController');
const upload = require('../../middleware/upload');

// List all reviews
router.get('/', reviewController.getAllReviews);
// Create review (with optional image upload)
router.post('/', upload.single('image'), reviewController.createReview);
// Delete review
router.delete('/:id', reviewController.deleteReview);

module.exports = router;