const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
  userId: { type: DataTypes.STRING },
  userName: { type: DataTypes.STRING },
  professionalId: { type: DataTypes.STRING },
  professionalType: { type: DataTypes.STRING },
  rating: { type: DataTypes.FLOAT },
  comment: { type: DataTypes.TEXT }
}, {
  timestamps: true
});

module.exports = Review;