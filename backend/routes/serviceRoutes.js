const express = require('express');
const { getServices, getDoctors, createService } = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getServices);
router.get('/doctors', getDoctors);
router.post('/', protect, createService);

module.exports = router;