const express = require('express');
const router = express.Router();

// Import your models
const Tutor = require('../models/Tutor');
const Service = require('../models/Service');
const Doctor = require('../models/Doctor');

// GET /api/lists/subjects - Return all tutor subjects
router.get('/subjects', async (req, res) => {
  try {
    // Get unique subjects from tutors collection
    const subjects = await Tutor.distinct('subject');
    
    res.json({
      success: true,
      data: subjects.filter(s => s && s !== '')
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// GET /api/lists/levels - Return all grade levels
router.get('/levels', async (req, res) => {
  try {
    // Get unique levels from tutors collection
    const levels = await Tutor.distinct('level');
    
    res.json({
      success: true,
      data: levels.filter(l => l && l !== '')
    });
  } catch (error) {
    console.error('Error fetching levels:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// GET /api/lists/professions - Return all service professions
router.get('/professions', async (req, res) => {
  try {
    // Get unique categories from services collection
    const professions = await Service.distinct('category');
    
    res.json({
      success: true,
      data: professions.filter(p => p && p !== '')
    });
  } catch (error) {
    console.error('Error fetching professions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// GET /api/lists/specialties - Return all doctor specialties
router.get('/specialties', async (req, res) => {
  try {
    // Get unique specialties from doctors collection
    const specialties = await Doctor.distinct('specialtyName');
    
    res.json({
      success: true,
      data: specialties.filter(s => s && s !== '')
    });
  } catch (error) {
    console.error('Error fetching specialties:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

module.exports = router;