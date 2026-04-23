const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String },
  level: { type: String },
  fee: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  experience: { type: String },
  city: { type: String },
  online: { type: Boolean, default: true },
  inperson: { type: Boolean, default: true },
  email: { type: String },
  phone: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Tutor', tutorSchema);