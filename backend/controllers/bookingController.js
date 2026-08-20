const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Doctor = require('../models/Doctor');
const Tutor = require('../models/Tutor');
const User = require('../models/User');

const createBooking = async (req, res) => {
  try {
    const { serviceType, itemId, bookingDate, time, bookingMode, description } = req.body;

    let item = null;
    let totalPrice = 0;
    let itemName = '';

    if (serviceType === 'doctor') {
      const doctors = await Doctor.findAll();
      item = doctors.find(d => d.id.toString() === itemId.toString());
      if (!item) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }
      totalPrice = item.fee;
      itemName = item.name;
    } else if (serviceType === 'service') {
      const services = await Service.findAll();
      item = services.find(s => s.id.toString() === itemId.toString());
      if (!item) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }
      totalPrice = item.price;
      itemName = item.title;
    } else if (serviceType === 'tutor') {
      const tutors = await Tutor.findAll();
      item = tutors.find(t => t.id.toString() === itemId.toString());
      if (!item) {
        return res.status(404).json({ success: false, message: 'Tutor not found' });
      }
      totalPrice = item.fee;
      itemName = item.name;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid service type' });
    }

    const serviceFee = totalPrice * 0.0095;
    const guaranteeFee = totalPrice * 0.05;
    const upfrontAmount = totalPrice * 0.0595;
    const remainingAmount = totalPrice - upfrontAmount;

    let providerEmail = '';
    let providerPhone = '';
    if (item.providerId) {
      const provider = await User.findByPk(parseInt(item.providerId));
      if (provider) {
        providerEmail = provider.email || '';
        providerPhone = provider.phone || '';
      }
    }

    const booking = await Booking.create({
      serviceType,
      itemId: itemId.toString(),
      itemName,
      customerId: req.user.id.toString(),
      customerName: req.user.name,
      customerEmail: req.user.email,
      customerPhone: req.user.phone || '',
      description: description || '',
      providerId: item.providerId || '',
      providerName: item.providerName || item.name || '',
      providerEmail,
      providerPhone,
      bookingDate: new Date(bookingDate),
      time,
      totalPrice,
      serviceFee,
      guaranteeFee,
      upfrontAmount,
      remainingAmount,
      bookingMode: bookingMode || 'online',
      status: 'pending_payment'
    });

    res.status(201).json({
      success: true,
      data: {
        bookingId: booking.id,
        totalPrice: Math.round(totalPrice),
        serviceFee: Math.round(serviceFee),
        guaranteeFee: Math.round(guaranteeFee),
        upfrontAmount: Math.round(upfrontAmount),
        remainingAmount: Math.round(remainingAmount),
        itemName
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { customerId: req.user.id.toString() },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { providerId: req.user.id.toString() },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    booking.status = status;
    if (status === 'completed') {
      booking.completedAt = new Date();
    }
    await booking.save();
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.status !== 'confirmed') {
      return res.status(400).json({ success: false, message: 'Booking not confirmed yet' });
    }
    booking.status = 'completed';
    booking.completedAt = new Date();
    await booking.save();
    res.json({
      success: true,
      message: `Service completed! Please pay remaining ${Math.round(booking.remainingAmount)} Br.`,
      data: { bookingId: booking.id, remainingAmount: booking.remainingAmount }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId || req.body.bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getProviderBookings,
  updateBookingStatus,
  completeBooking,
  cancelBooking
};
