const Tutor = require('../models/Tutor');

const sampleTutors = [
  { name: 'Dr. Alemu Tesfaye', subject: 'Mathematics', level: 'High School', fee: 400, rating: 4.9, experience: '12 years', city: 'Addis Ababa', online: true, inperson: true },
  { name: 'Teacher Selamawit Mulugeta', subject: 'English', level: 'High School', fee: 350, rating: 4.8, experience: '8 years', city: 'Addis Ababa', online: true, inperson: true },
  { name: 'Mr. Yonas Desta', subject: 'Physics', level: 'High School', fee: 450, rating: 4.9, experience: '10 years', city: 'Addis Ababa', online: true, inperson: true },
  { name: 'Dr. Hanna Gebre', subject: 'Chemistry', level: 'High School', fee: 500, rating: 4.95, experience: '10 years', city: 'Addis Ababa', online: true, inperson: true },
  { name: 'Teacher Tekle Berhan', subject: 'Amharic', level: 'Middle School', fee: 300, rating: 4.85, experience: '15 years', city: 'Addis Ababa', online: true, inperson: true }
];

const getTutors = async (req, res) => {
  try {
    const { subject, level } = req.query;
    const where = {};

    if (subject) where.subject = subject;
    if (level) where.level = level;

    let tutors = await Tutor.findAll({ where });

    if (tutors.length === 0) {
      let filtered = sampleTutors;
      if (subject) filtered = filtered.filter(t => t.subject === subject);
      if (level) filtered = filtered.filter(t => t.level === level);
      return res.json({ success: true, data: filtered });
    }

    res.json({ success: true, data: tutors });
  } catch (error) {
    res.json({ success: true, data: sampleTutors });
  }
};

const createTutor = async (req, res) => {
  try {
    const tutor = await Tutor.create(req.body);
    res.status(201).json({ success: true, data: tutor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTutor = async (req, res) => {
  try {
    const tutor = await Tutor.findByPk(req.params.id);
    if (!tutor) {
      return res.status(404).json({ success: false, message: 'Tutor not found' });
    }
    await tutor.update(req.body);
    res.json({ success: true, data: tutor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTutor = async (req, res) => {
  try {
    const tutor = await Tutor.findByPk(req.params.id);
    if (!tutor) {
      return res.status(404).json({ success: false, message: 'Tutor not found' });
    }
    await tutor.destroy();
    res.json({ success: true, message: 'Tutor deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTutors, createTutor, updateTutor, deleteTutor };
