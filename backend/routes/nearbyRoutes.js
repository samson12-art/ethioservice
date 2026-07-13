const express = require('express');
const { getNearbyServices } = require('../controllers/locationController');

const router = express.Router();

router.get('/', getNearbyServices);

module.exports = router;
