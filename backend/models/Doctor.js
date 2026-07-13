const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Doctor = sequelize.define('Doctor', {
  name: { type: DataTypes.STRING, allowNull: false },
  specialtyName: { type: DataTypes.STRING },
  hospital: { type: DataTypes.STRING },
  fee: { type: DataTypes.FLOAT },
  rating: { type: DataTypes.FLOAT, defaultValue: 4.5 },
  city: { type: DataTypes.STRING }
}, {
  timestamps: true
});

module.exports = Doctor;