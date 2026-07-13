const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const Review = require('../models/Review');
const Service = require('../models/Service');
const Booking = require('../models/Booking');

const router = express.Router();

router.post('/', protect, async (req, res) => {
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
