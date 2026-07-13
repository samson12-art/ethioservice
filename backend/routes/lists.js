const express = require('express');
const router = express.Router();

const Tutor = require('../models/Tutor');
const Service = require('../models/Service');
const Doctor = require('../models/Doctor');

router.get('/subjects', async (req, res) => {
  try {
    const subjects = await Tutor.findAll({
      attributes: [[require('sequelize').fn('DISTINCT', require('sequelize').col('subject')), 'subject']]
    });
    const result = subjects.map(s => s.subject).filter(s => s && s !== '');
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/levels', async (req, res) => {
  try {
    const levels = await Tutor.findAll({
      attributes: [[require('sequelize').fn('DISTINCT', require('sequelize').col('level')), 'level']]
    });
    const result = levels.map(l => l.level).filter(l => l && l !== '');
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/professions', async (req, res) => {
  try {
    const professions = await Service.findAll({
      attributes: [[require('sequelize').fn('DISTINCT', require('sequelize').col('category')), 'category']]
    });
    const result = professions.map(p => p.category).filter(p => p && p !== '');
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/specialties', async (req, res) => {
  try {
    const specialties = await Doctor.findAll({
      attributes: [[require('sequelize').fn('DISTINCT', require('sequelize').col('specialtyName')), 'specialtyName']]
    });
    const result = specialties.map(s => s.specialtyName).filter(s => s && s !== '');
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
