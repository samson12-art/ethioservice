const express = require('express');
const { getServices, getDoctors, createService, updateService, deleteService, getMyServices } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getServices);
router.get('/doctors', getDoctors);
router.get('/my-services', protect, authorize('provider', 'admin'), getMyServices);

router.post('/', protect, authorize('admin', 'provider'), createService);
router.put('/:id', protect, authorize('admin', 'provider'), updateService);
router.delete('/:id', protect, authorize('admin', 'provider'), deleteService);

module.exports = router;
