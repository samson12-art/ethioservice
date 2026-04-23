const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialtyName: { type: String },
  hospital: { type: String },
  fee: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  experience: { type: String },
  available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);