const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const Review = require('../models/Review');
const Service = require('../models/Service');
const Doctor = require('../models/Doctor');
const Tutor = require('../models/Tutor');
const { reviewValidation } = require('../middleware/validation');

const router = express.Router();

router.post('/', protect, reviewValidation, async (req, res) => {
  try {
    const { professionalId, professionalType, rating, comment } = req.body;

    const review = await Review.create({
      userId: req.user.id.toString(),
      userName: req.user.name,
      professionalId,
      professionalType,
      rating,
      comment
    });

    // Update provider's average rating
    const reviews = await Review.findAll({ where: { professionalId } });
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      const rounded = parseFloat(avgRating.toFixed(1));

      try {
        if (professionalType === 'service') {
          await Service.update({ rating: rounded }, { where: { id: professionalId } });
        } else if (professionalType === 'doctor') {
          await Doctor.update({ rating: rounded }, { where: { id: professionalId } });
        } else if (professionalType === 'tutor') {
          await Tutor.update({ rating: rounded }, { where: { id: professionalId } });
        }
      } catch (e) {
        // Best-effort rating update
      }
    }

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/my-reviews', protect, async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { userId: req.user.id.toString() },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/provider-reviews', protect, authorize('provider', 'admin'), async (req, res) => {
  try {
    const myServices = await Service.findAll({
      where: { providerId: req.user.id.toString() },
      attributes: ['id']
    });
    const serviceIds = myServices.map(s => s.id.toString());

    const reviews = await Review.findAll({
      where: { professionalId: serviceIds },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
