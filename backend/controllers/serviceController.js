const Service = require('../models/Service');
const Doctor = require('../models/Doctor');

const getServices = async (req, res) => {
  try {
    const { category, city } = req.query;
    let query = { isAvailable: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    if (city && city !== 'all') {
      query.city = city;
    }
    
    const services = await Service.find(query).populate('provider', 'name email phone avatar');
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getDoctors = async (req, res) => {
  try {
    const { specialty, city } = req.query;
    let query = { isAvailable: true };
    
    if (specialty && specialty !== 'all') {
      query.specialty = specialty;
    }
    if (city && city !== 'all') {
      query.city = city;
    }
    
    const doctors = await Doctor.find(query);
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const service = await Service.create({
      ...req.body,
      provider: req.user._id
    });
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
// Get tutors by subject and grade level
const getTutorsBySubject = async (req, res) => {
  try {
    const { subject, gradeLevel } = req.query;
    let query = { category: 'tutor', isAvailable: true };
    
    if (subject && subject !== '') {
      query.subject = subject;
    }
    if (gradeLevel && gradeLevel !== '') {
      query.gradeLevel = gradeLevel;
    }
    
    const tutors = await Service.find(query).populate('provider', 'name email phone avatar');
    res.json({ success: true, data: tutors });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
module.exports = { getServices, getDoctors, createService,getTutorsBySubject};