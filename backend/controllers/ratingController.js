const Rating = require('../models/Rating');

const submitRating = async (req, res) => {
  try {
    const { professionalId, professionalType, professionalName, rating, review, bookingId } = req.body;

    const existing = await Rating.findOne({
      where: { userId: req.user.id.toString(), professionalId, professionalType }
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already rated this professional' });
    }

    const newRating = await Rating.create({
      userId: req.user.id.toString(),
      professionalId,
      professionalType,
      professionalName,
      rating,
      review,
      bookingId
    });

    res.status(201).json({ success: true, data: newRating });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRatings = async (req, res) => {
  try {
    const { professionalId, professionalType } = req.params;
    const ratings = await Rating.findAll({
      where: { professionalId, professionalType }
    });

    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    res.json({
      success: true,
      data: ratings,
      averageRating: avgRating.toFixed(1),
      totalReviews: ratings.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { userId: req.user.id.toString() },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: ratings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { submitRating, getRatings, getUserRatings };
