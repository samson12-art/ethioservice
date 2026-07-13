const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Rating = sequelize.define('Rating', {
  userId: { type: DataTypes.STRING },
  professionalId: { type: DataTypes.STRING },
  professionalType: { type: DataTypes.STRING },
  professionalName: { type: DataTypes.STRING },
  rating: { type: DataTypes.FLOAT },
  review: { type: DataTypes.TEXT },
  bookingId: { type: DataTypes.STRING }
}, {
  timestamps: true
});

module.exports = Rating;