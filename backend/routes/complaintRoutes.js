const express = require('express');
const { submitComplaint, getMyComplaints, getAllComplaints, replyToComplaint } = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');
const { complaintValidation } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router.post('/', complaintValidation, submitComplaint);
router.get('/my', getMyComplaints);
router.get('/all', authorize('admin'), getAllComplaints);
router.put('/:id/reply', authorize('admin'), replyToComplaint);

module.exports = router;
