const express = require('express');
const { registerCustomer, registerProvider, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerCustomer);
router.post('/register-provider', registerProvider);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
