const { body, param, query, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  }
  next();
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidation
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation
];

const bookingValidation = [
  body('serviceType').isIn(['doctor', 'service', 'tutor']).withMessage('Invalid service type'),
  body('itemId').notEmpty().withMessage('Item ID is required'),
  body('bookingDate').isISO8601().withMessage('Valid booking date is required'),
  handleValidation
];

const paymentValidation = [
  body('bookingId').notEmpty().withMessage('Booking ID is required'),
  body('method').isIn(['telebirr', 'chapa', 'cash']).withMessage('Invalid payment method'),
  handleValidation
];

const messageValidation = [
  body('receiverId').notEmpty().withMessage('Receiver ID is required'),
  body('message').trim().notEmpty().withMessage('Message cannot be empty'),
  handleValidation
];

const reviewValidation = [
  body('professionalId').notEmpty().withMessage('Professional ID is required'),
  body('rating').isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Review comment is required'),
  handleValidation
];

const complaintValidation = [
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  handleValidation
];

module.exports = {
  registerValidation,
  loginValidation,
  bookingValidation,
  paymentValidation,
  messageValidation,
  reviewValidation,
  complaintValidation,
  handleValidation
};
