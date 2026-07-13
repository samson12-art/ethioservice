const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

const processPayment = async (req, res) => {
  try {
    const { bookingId, method, phoneNumber, email } = req.body;

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status !== 'pending_payment') {
      return res.status(400).json({ success: false, message: 'Payment already processed' });
    }

    const transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8).toUpperCase();

    await Payment.create({
      bookingId: bookingId.toString(),
      userId: req.user.id.toString(),
      amount: booking.upfrontAmount,
      method,
      status: 'completed',
      transactionId,
      phoneNumber,
      email,
      paymentType: 'upfront'
    });

    booking.paymentMethod = method;
    booking.paymentId = transactionId;
    booking.status = 'confirmed';
    booking.upfrontPaid = true;
    await booking.save();

    res.json({
      success: true,
      message: `Upfront payment of ${Math.round(booking.upfrontAmount)} Br successful! Booking confirmed.`,
      data: {
        bookingId: booking.id,
        transactionId,
        upfrontAmount: booking.upfrontAmount,
        remainingAmount: booking.remainingAmount,
        method
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const processRemainingPayment = async (req, res) => {
  try {
    const { bookingId, method, phoneNumber, email } = req.body;

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Service not completed yet' });
    }

    if (booking.remainingPaid) {
      return res.status(400).json({ success: false, message: 'Remaining payment already processed' });
    }

    const transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8).toUpperCase();

    await Payment.create({
      bookingId: bookingId.toString(),
      userId: req.user.id.toString(),
      amount: booking.remainingAmount,
      method,
      status: 'completed',
      transactionId,
      phoneNumber,
      email,
      paymentType: 'remaining'
    });

    booking.remainingPaid = true;
    booking.status = 'fully_paid';
    await booking.save();

    res.json({
      success: true,
      message: `Remaining payment of ${Math.round(booking.remainingAmount)} Br successful! Booking fully paid.`,
      data: { bookingId: booking.id, transactionId, remainingAmount: booking.remainingAmount }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { userId: req.user.id.toString() },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPaymentStatus = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({
      success: true,
      paymentStatus: booking.upfrontPaid ? 'paid' : 'pending',
      paymentMethod: booking.paymentMethod,
      amount: booking.totalPrice,
      transactionId: booking.paymentId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { processPayment, processRemainingPayment, getPaymentHistory, getPaymentStatus };
