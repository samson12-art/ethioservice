const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Message = sequelize.define('Message', {
  senderId: { type: DataTypes.STRING },
  receiverId: { type: DataTypes.STRING },
  message: { type: DataTypes.TEXT },
  read: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  timestamps: true
});

module.exports = Message;