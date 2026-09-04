const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });
};

const registerCustomer = async (req, res) => {
  try {
    const { name, password, phone, city } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

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
    const { name, password, phone, city, profession, experience, price, priceUnit, description, agreedToTerms } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    if (!name || !email || !password || !phone || !profession || !experience || !price) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    if (agreedToTerms !== 'true') {
      return res.status(400).json({ success: false, message: 'You must agree to the provider terms and conditions' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const certificateUrl = req.files?.certificate ? `/uploads/${req.files.certificate[0].filename}` : null;
    const experienceLetterUrl = req.files?.experienceLetter ? `/uploads/${req.files.experienceLetter[0].filename}` : null;

    if (!certificateUrl) {
      return res.status(400).json({ success: false, message: 'Professional certificate is required' });
    }
    if (!experienceLetterUrl) {
      return res.status(400).json({ success: false, message: 'Experience letter is required' });
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
      isVerified: false,
      certificateUrl,
      experienceLetterUrl,
      agreedToTerms: true
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
    const password = req.body.password;
    const email = req.body.email?.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

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
