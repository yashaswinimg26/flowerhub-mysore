const express = require('express');
const router = express.Router();
const Florist = require('../models/Florist');

// GET /api/florists - List and filter florists
router.get('/', async (req, res) => {
  try {
    const { eventType, area, minPrice, maxPrice, search, minRating } = req.query;
    let query = {};

    if (eventType && eventType !== 'All') {
      query.specialties = { $in: [eventType] };
    }

    if (area && area !== 'All Mysuru') {
      query.area = area;
    }

    if (minPrice || maxPrice) {
      query.startingPrice = {};
      if (minPrice) query.startingPrice.$gte = Number(minPrice);
      if (maxPrice) query.startingPrice.$lte = Number(maxPrice);
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { area: { $regex: search, $options: 'i' } },
        { specialties: { $regex: search, $options: 'i' } }
      ];
    }

    const florists = await Florist.find(query).sort({ rating: -1, reviewCount: -1 });
    res.json(florists);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch florists', message: err.message });
  }
});

// GET /api/florists/:id - Detail view + increment views
router.get('/:id', async (req, res) => {
  try {
    const florist = await Florist.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!florist) return res.status(404).json({ error: 'Florist not found' });
    res.json(florist);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch florist', message: err.message });
  }
});

// POST /api/florists - Signup / Register new florist
router.post('/', async (req, res) => {
  try {
    const florist = new Florist(req.body);
    await florist.save();
    res.status(201).json(florist);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create florist', message: err.message });
  }
});

// PUT /api/florists/:id - Update profile/pricing/status
router.put('/:id', async (req, res) => {
  try {
    const florist = await Florist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!florist) return res.status(404).json({ error: 'Florist not found' });
    res.json(florist);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update florist', message: err.message });
  }
});

// POST /api/florists/:id/portfolio - Add portfolio photo
router.post('/:id/portfolio', async (req, res) => {
  try {
    const { url, title, category, price } = req.body;
    const florist = await Florist.findById(req.params.id);
    if (!florist) return res.status(404).json({ error: 'Florist not found' });

    const newPhoto = {
      id: Date.now().toString(),
      url,
      title: title || 'New Decoration Photo',
      category: category || 'Wedding',
      price: price || florist.startingPrice
    };

    florist.portfolio.unshift(newPhoto);
    await florist.save();
    res.json(florist);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add portfolio photo', message: err.message });
  }
});

// DELETE /api/florists/:id/portfolio/:photoId - Delete portfolio photo
router.delete('/:id/portfolio/:photoId', async (req, res) => {
  try {
    const florist = await Florist.findById(req.params.id);
    if (!florist) return res.status(404).json({ error: 'Florist not found' });

    florist.portfolio = florist.portfolio.filter(p => p.id !== req.params.photoId);
    await florist.save();
    res.json(florist);
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete photo', message: err.message });
  }
});

module.exports = router;
