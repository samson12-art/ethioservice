const express = require('express');
const { processPayment, processRemainingPayment, getPaymentHistory, getPaymentStatus } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');
const Booking = require('../models/Booking');

const router = express.Router();

router.use(protect);

router.post('/initiate', processPayment);
router.post('/remaining', processRemainingPayment);
router.get('/history', getPaymentHistory);
router.get('/status/:bookingId', getPaymentStatus);

router.get('/earnings', authorize('provider', 'admin'), async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { providerId: req.user.id.toString() },
      order: [['createdAt', 'DESC']]
    });

    const totalEarnings = bookings
      .filter(b => ['completed', 'fully_paid'].includes(b.status))
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const totalUpfront = bookings
      .filter(b => b.upfrontPaid)
      .reduce((sum, b) => sum + (b.upfrontAmount || 0), 0);

    const totalRemaining = bookings
      .filter(b => b.remainingPaid)
      .reduce((sum, b) => sum + (b.remainingAmount || 0), 0);

    const pendingPayments = bookings
      .filter(b => b.status === 'completed' && !b.remainingPaid)
      .reduce((sum, b) => sum + (b.remainingAmount || 0), 0);

    res.json({
      success: true,
      data: {
        totalBookings: bookings.length,
        completedBookings: bookings.filter(b => ['completed', 'fully_paid'].includes(b.status)).length,
        totalEarnings: Math.round(totalEarnings),
        totalUpfront: Math.round(totalUpfront),
        totalRemaining: Math.round(totalRemaining),
        pendingPayments: Math.round(pendingPayments),
        bookings
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
