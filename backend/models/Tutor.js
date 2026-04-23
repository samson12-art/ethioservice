const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  gradeLevel: { type: String, required: true },
  qualification: { type: String, required: true },
  experience: { type: String, required: true },
  fee: { type: Number, required: true },
  city: { type: String, default: 'Addis Ababa' },
  rating: { type: Number, default: 4.5 },
  imageUrl: { type: String },
  isAvailable: { type: Boolean, default: true }
});

module.exports = mongoose.model('Tutor', tutorSchema);