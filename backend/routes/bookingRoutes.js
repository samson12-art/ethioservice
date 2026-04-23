const express = require('express');
const { 
  createBooking, 
  getUserBookings, 
  getProviderBookings,
  updateBookingStatus,
  addProviderReview,
  cancelBooking 
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getUserBookings);
router.get('/provider-bookings', protect, getProviderBookings);
router.put('/status', protect, updateBookingStatus);
router.put('/review', protect, addProviderReview);
router.put('/cancel', protect, cancelBooking);

module.exports = router;