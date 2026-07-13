const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
  serviceType: { type: DataTypes.STRING },
  itemId: { type: DataTypes.STRING },
  itemName: { type: DataTypes.STRING },
  customerId: { type: DataTypes.STRING },
  providerId: { type: DataTypes.STRING },
  providerName: { type: DataTypes.STRING },
  bookingDate: { type: DataTypes.DATE },
  time: { type: DataTypes.STRING },
  totalPrice: { type: DataTypes.FLOAT },
  serviceFee: { type: DataTypes.FLOAT },
  guaranteeFee: { type: DataTypes.FLOAT },
  upfrontAmount: { type: DataTypes.FLOAT },
  remainingAmount: { type: DataTypes.FLOAT },
  bookingMode: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'pending_payment' },
  paymentMethod: { type: DataTypes.STRING },
  paymentId: { type: DataTypes.STRING },
  upfrontPaid: { type: DataTypes.BOOLEAN, defaultValue: false },
  remainingPaid: { type: DataTypes.BOOLEAN, defaultValue: false },
  completedAt: { type: DataTypes.DATE }
}, {
  timestamps: true
});

module.exports = Booking;