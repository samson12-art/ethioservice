const express = require('express');
const Tutor = require('../models/Tutor');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { subject, gradeLevel } = req.query;
    let query = { isAvailable: true };
    if (subject) query.subject = subject;
    if (gradeLevel) query.gradeLevel = gradeLevel;
    
    const tutors = await Tutor.find(query);
    res.json({ success: true, data: tutors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;