const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'ethioservice_secret_key_2024', { expiresIn: '30d' });
};

const registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phone, city } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'customer',
      phone: phone || '',
      city: city || 'Addis Ababa'
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, city: user.city }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const registerProvider = async (req, res) => {
  try {
    const { name, email, password, phone, city, profession, experience, price, priceUnit, description } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'provider',
      phone: phone || '',
      city: city || 'Addis Ababa',
      profession,
      experience,
      price,
      priceUnit,
      description,
      isVerified: false
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, city: user.city, isVerified: false }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, city: user.city, isVerified: user.isVerified }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerCustomer, registerProvider, login, getMe };
