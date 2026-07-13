const express = require('express');
const { getPendingProviders, verifyProvider, rejectProvider, getStats, getAllUsers, deleteUser, getAllBookings } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/pending-providers', getPendingProviders);
router.put('/verify-provider/:id', verifyProvider);
router.put('/reject-provider/:id', rejectProvider);
router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/bookings', getAllBookings);

module.exports = router;
