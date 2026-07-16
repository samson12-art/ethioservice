const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const logger = require('../config/logger');

const initiatePayment = async (req, res) => {
  try {
    const { bookingId, method, phoneNumber, email } = req.body;

    if (!bookingId || !method) {
      return res.status(400).json({ success: false, message: 'Booking ID and payment method are required' });
    }

    if (!['telebirr', 'chapa', 'cash'].includes(method)) {
      return res.status(400).json({ success: false, message: 'Invalid payment method. Use telebirr, chapa, or cash' });
    }

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status !== 'pending_payment') {
      return res.status(400).json({ success: false, message: 'Payment already processed for this booking' });
    }

    // For cash payments, mark immediately
    if (method === 'cash') {
      const transactionId = 'CASH_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8).toUpperCase();

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

      return res.json({
        success: true,
        message: `Cash payment of ${Math.round(booking.upfrontAmount)} Br recorded. Booking confirmed.`,
        data: {
          bookingId: booking.id,
          transactionId,
          upfrontAmount: booking.upfrontAmount,
          remainingAmount: booking.remainingAmount,
          method
        }
      });
    }

    // For Telebirr or Chapa - initiate via their APIs
    if (method === 'chapa') {
      // Chapa integration
      const CHAPA_SECRET = process.env.CHAPA_SECRET_KEY;
      const CHAPA_BASE = process.env.CHAPA_BASE_URL || 'https://api.chapa.co';

      if (!CHAPA_SECRET) {
        logger.warn('Chapa secret key not configured, processing as simulated payment');
      }

      const transactionId = 'CHAPA_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8).toUpperCase();

      // TODO: When you have Chapa credentials, uncomment and implement:
      // const response = await axios.post(`${CHAPA_BASE}/v1/transaction/initialize`, {
      //   amount: booking.upfrontAmount,
      //   currency: 'ETB',
      //   email: email || req.user.email,
      //   phone_number: phoneNumber,
      //   tx_ref: transactionId,
      //   callback_url: `${process.env.APP_URL || 'http://localhost:5000'}/api/payments/webhook/chapa`,
      //   return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payments`,
      //   customization: { title: 'EthioService Payment', description: `Booking #${bookingId}` }
      // }, { headers: { Authorization: `Bearer ${CHAPA_SECRET}`, 'Content-Type': 'application/json' } });

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

      return res.json({
        success: true,
        message: `Chapa payment of ${Math.round(booking.upfrontAmount)} Br initiated.`,
        data: {
          bookingId: booking.id,
          transactionId,
          upfrontAmount: booking.upfrontAmount,
          remainingAmount: booking.remainingAmount,
          method,
          checkout_url: null // Will be populated when Chapa API is connected
        }
      });
    }

    if (method === 'telebirr') {
      // Telebirr integration
      const transactionId = 'TBL_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8).toUpperCase();

      // TODO: When you have Telebirr credentials, uncomment and implement:
      // const crypto = require('crypto');
      // const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '').slice(0, 14);
      // const nonce = crypto.randomBytes(10).toString('hex');
      // const payload = { ... };
      // Sign with Telebirr keys and call their API endpoint

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

      return res.json({
        success: true,
        message: `Telebirr payment of ${Math.round(booking.upfrontAmount)} Br initiated.`,
        data: {
          bookingId: booking.id,
          transactionId,
          upfrontAmount: booking.upfrontAmount,
          remainingAmount: booking.remainingAmount,
          method
        }
      });
    }
  } catch (error) {
    logger.error('Payment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const processRemainingPayment = async (req, res) => {
  try {
    const { bookingId, method, phoneNumber, email } = req.body;

    if (!bookingId || !method) {
      return res.status(400).json({ success: false, message: 'Booking ID and payment method are required' });
    }

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

    const prefix = method === 'chapa' ? 'CHAPA' : method === 'telebirr' ? 'TBL' : 'CASH';
    const transactionId = `${prefix}_REM_${Date.now()}_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

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
    logger.error('Remaining payment error:', error);
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

module.exports = { initiatePayment, processRemainingPayment, getPaymentHistory, getPaymentStatus };
