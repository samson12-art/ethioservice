const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
  bookingId: { type: DataTypes.STRING },
  userId: { type: DataTypes.STRING },
  amount: { type: DataTypes.FLOAT },
  method: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING },
  transactionId: { type: DataTypes.STRING },
  phoneNumber: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  paymentType: { type: DataTypes.STRING }
}, {
  timestamps: true
});

module.exports = Payment;