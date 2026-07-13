const express = require('express');
const { getTutors, createTutor, updateTutor, deleteTutor } = require('../controllers/tutorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getTutors);

router.post('/', protect, authorize('admin', 'provider'), createTutor);
router.put('/:id', protect, authorize('admin', 'provider'), updateTutor);
router.delete('/:id', protect, authorize('admin'), deleteTutor);

module.exports = router;
