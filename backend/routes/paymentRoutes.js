const express = require('express');
const { 
  processTelebirrPayment, 
  processChapaPayment, 
  processCashPayment,
  getPaymentStatus 
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/telebirr', protect, processTelebirrPayment);
router.post('/chapa', protect, processChapaPayment);
router.post('/cash', protect, processCashPayment);
router.get('/status/:bookingId', protect, getPaymentStatus);

module.exports = router;