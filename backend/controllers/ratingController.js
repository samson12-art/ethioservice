const Rating = require('../models/Rating');
const Service = require('../models/Service');
const Doctor = require('../models/Doctor');
const Tutor = require('../models/Tutor');

const updateProviderRating = async (professionalId, professionalType) => {
  const ratings = await Rating.findAll({
    where: { professionalId, professionalType }
  });

  if (ratings.length === 0) return;

  const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

  try {
    if (professionalType === 'service') {
      await Service.update({ rating: parseFloat(avgRating.toFixed(1)) }, { where: { id: professionalId } });
    } else if (professionalType === 'doctor') {
      await Doctor.update({ rating: parseFloat(avgRating.toFixed(1)) }, { where: { id: professionalId } });
    } else if (professionalType === 'tutor') {
      await Tutor.update({ rating: parseFloat(avgRating.toFixed(1)) }, { where: { id: professionalId } });
    }
  } catch (err) {
    // Rating update is best-effort, don't fail the rating submission
  }
};

const submitRating = async (req, res) => {
  try {
    const { professionalId, professionalType, professionalName, rating, review, bookingId } = req.body;

    if (!professionalId || !professionalType || !rating) {
      return res.status(400).json({ success: false, message: 'Professional ID, type, and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

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

    // Update the provider's average rating
    await updateProviderRating(professionalId, professionalType);

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
