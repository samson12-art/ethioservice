const User = require('../models/User');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Service = require('../models/Service');
const Doctor = require('../models/Doctor');
const Tutor = require('../models/Tutor');

const getPendingProviders = async (req, res) => {
  try {
    const providers = await User.findAll({
      where: { role: 'provider', isVerified: false },
      attributes: { exclude: ['password'] }
    });
    res.json({ success: true, data: providers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyProvider = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    await user.update({ isVerified: true });
    res.json({ success: true, message: 'Provider verified' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const rejectProvider = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    await user.update({ isVerified: false });
    res.json({ success: true, message: 'Provider rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalCustomers = await User.count({ where: { role: 'customer' } });
    const totalProviders = await User.count({ where: { role: 'provider' } });
    const pendingProviders = await User.count({ where: { role: 'provider', isVerified: false } });
    const verifiedProviders = await User.count({ where: { role: 'provider', isVerified: true } });
    const totalBookings = await Booking.count();
    const totalServices = await Service.count();
    const totalDoctors = await Doctor.count();
    const totalTutors = await Tutor.count();

    const payments = await Payment.findAll();
    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalCustomers,
        totalProviders,
        pendingProviders,
        verifiedProviders,
        totalBookings,
        totalServices,
        totalDoctors,
        totalTutors,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const where = {};
    if (role) where.role = role;

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await user.destroy();
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPendingProviders,
  verifyProvider,
  rejectProvider,
  getStats,
  getAllUsers,
  deleteUser,
  getAllBookings
};
