const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String },
  price: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);