const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Tutor = sequelize.define('Tutor', {
  name: { type: DataTypes.STRING, allowNull: false },
  subject: { type: DataTypes.STRING },
  level: { type: DataTypes.STRING },
  fee: { type: DataTypes.FLOAT },
  rating: { type: DataTypes.FLOAT, defaultValue: 4.5 },
  experience: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  online: { type: DataTypes.BOOLEAN, defaultValue: true },
  inperson: { type: DataTypes.BOOLEAN, defaultValue: true },
  providerId: { type: DataTypes.STRING },
  providerName: { type: DataTypes.STRING }
}, {
  timestamps: true
});

module.exports = Tutor;