const express = require('express');
const { submitRating, getRatings, getUserRatings } = require('../controllers/ratingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, submitRating);
router.get('/my-ratings', protect, getUserRatings);
router.get('/professional/:professionalId/:professionalType', getRatings);

module.exports = router;
