const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Service = sequelize.define('Service', {
  title: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT },
  rating: { type: DataTypes.FLOAT, defaultValue: 4.5 },
  city: { type: DataTypes.STRING },
  providerId: { type: DataTypes.STRING },
  providerName: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT }
}, {
  timestamps: true
});

module.exports = Service;