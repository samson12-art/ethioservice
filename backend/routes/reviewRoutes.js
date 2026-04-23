const express = require('express');
const { protect } = require('../middleware/auth');
const Review = require('../models/Review');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { professionalId, professionalType, rating, comment } = req.body;
    
    const review = await Review.create({
      user: req.user._id,
      userName: req.user.name,
      professionalId,
      professionalType,
      rating,
      comment
    });
    
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/my-reviews', protect, async (req, res) => {
  const reviews = await Review.find({ user: req.user._id }).sort('-createdAt');
  res.json({ success: true, data: reviews });
});

module.exports = router;