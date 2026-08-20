const express = require('express');
const {
  submitComplaint,
  getMyComplaints,
  getAllComplaints,
  replyToComplaint,
  assignComplaint,
  getProviderComplaints,
  updateProviderNotes,
  getAllProviders
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');
const { complaintValidation } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router.post('/', complaintValidation, submitComplaint);
router.get('/my', getMyComplaints);
router.get('/all', authorize('admin'), getAllComplaints);
router.put('/:id/reply', authorize('admin'), replyToComplaint);
router.put('/:id/assign', authorize('admin'), assignComplaint);
router.get('/provider', authorize('provider'), getProviderComplaints);
router.put('/:id/follow-up', authorize('provider'), updateProviderNotes);
router.get('/providers', authorize('admin'), getAllProviders);

module.exports = router;
