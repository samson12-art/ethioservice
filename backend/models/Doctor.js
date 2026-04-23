const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  specialtyName: { type: String, required: true },
  experience: { type: String, required: true },
  hospital: { type: String, required: true },
  fee: { type: Number, required: true },
  city: { type: String, required: true },
  rating: { type: Number, default: 0 },
  avatar: { type: String },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);