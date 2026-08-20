const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Complaint = sequelize.define('Complaint', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  userName: { type: DataTypes.STRING, allowNull: false },
  userEmail: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  subject: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  adminReply: { type: DataTypes.TEXT },
  assignedProviderId: { type: DataTypes.INTEGER },
  assignedProviderName: { type: DataTypes.STRING },
  providerNotes: { type: DataTypes.TEXT },
  assignedAt: { type: DataTypes.DATE }
}, {
  timestamps: true
});

module.exports = Complaint;
