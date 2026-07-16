const User = require('../models/User');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Service = require('../models/Service');
const Doctor = require('../models/Doctor');
const Tutor = require('../models/Tutor');
const Complaint = require('../models/Complaint');

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
    if (user.role !== 'provider') {
      return res.status(400).json({ success: false, message: 'User is not a provider' });
    }
    await user.update({ isVerified: true });

    // Auto-create service listing from provider profile
    const existingService = await Service.findOne({
      where: { providerId: user.id.toString() }
    });

    if (!existingService && user.profession) {
      await Service.create({
        title: `${user.profession} Service by ${user.name}`,
        category: user.profession.toLowerCase(),
        price: user.price || 0,
        rating: 4.5,
        city: user.city || 'Addis Ababa',
        providerId: user.id.toString(),
        providerName: user.name,
        description: user.description || `${user.profession} with ${user.experience || 'N/A'} experience`
      });
    }

    res.json({ success: true, message: 'Provider verified and listed in services' });
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

    // Remove their service listing
    await Service.destroy({ where: { providerId: user.id.toString() } });

    res.json({ success: true, message: 'Provider rejected and service removed' });
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
    const totalComplaints = await Complaint.count();
    const pendingComplaints = await Complaint.count({ where: { status: 'pending' } });

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
        totalRevenue,
        totalComplaints,
        pendingComplaints
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
