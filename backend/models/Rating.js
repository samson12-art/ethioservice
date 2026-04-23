const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  professionalId: { type: String, required: true },
  professionalType: { type: String, enum: ['service', 'doctor', 'tutor'], required: true },
  professionalName: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  review: { type: String, required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rating', ratingSchema);