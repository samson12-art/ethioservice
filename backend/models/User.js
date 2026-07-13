const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'customer' },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  profession: { type: DataTypes.STRING },
  experience: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT },
  priceUnit: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT }
}, {
  timestamps: true,
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

User.prototype.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;