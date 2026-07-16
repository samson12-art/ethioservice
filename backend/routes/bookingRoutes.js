const express = require('express');
const { createBooking, getUserBookings, getProviderBookings, updateBookingStatus, completeBooking, cancelBooking } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const { bookingValidation } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router.post('/', authorize('customer'), bookingValidation, createBooking);
router.get('/my-bookings', getUserBookings);
router.get('/provider-bookings', authorize('provider', 'admin'), getProviderBookings);
router.put('/status', authorize('provider', 'admin'), updateBookingStatus);
router.post('/complete/:bookingId', completeBooking);
router.put('/cancel/:bookingId', cancelBooking);

module.exports = router;
