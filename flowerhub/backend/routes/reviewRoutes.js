const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Florist = require('../models/Florist');

// GET /api/reviews/florist/:floristId
router.get('/florist/:floristId', async (req, res) => {
  try {
    const reviews = await Review.find({ floristId: req.params.floristId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews', message: err.message });
  }
});

// POST /api/reviews - Add review & recalculate rating
router.post('/', async (req, res) => {
  try {
    const { floristId, customerName, rating, eventType, comment } = req.body;

    const review = new Review({
      floristId,
      customerName,
      rating: Number(rating),
      eventType: eventType || 'General Event',
      comment
    });
    await review.save();

    // Recalculate florist rating
    const allReviews = await Review.find({ floristId });
    const avgRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1);

    await Florist.findByIdAndUpdate(floristId, {
      rating: Number(avgRating),
      reviewCount: allReviews.length
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: 'Failed to save review', message: err.message });
  }
});

module.exports = router;
