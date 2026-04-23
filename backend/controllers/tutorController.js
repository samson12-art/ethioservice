const Tutor = require('../models/Tutor');

// Sample tutors if database is empty
const sampleTutors = [
  {
    name: "Dr. Alemu Tesfaye",
    subject: "Mathematics",
    gradeLevel: "Grade 11-12",
    qualification: "PhD in Mathematics",
    experience: "12 years",
    fee: 400,
    city: "Addis Ababa",
    rating: 4.9,
    isAvailable: true
  },
  {
    name: "Teacher Selamawit Mulugeta",
    subject: "English",
    gradeLevel: "Grade 9-10",
    qualification: "MA in English",
    experience: "8 years",
    fee: 350,
    city: "Addis Ababa",
    rating: 4.8,
    isAvailable: true
  },
  {
    name: "Mr. Yonas Desta",
    subject: "Physics",
    gradeLevel: "Grade 11-12",
    qualification: "MSc in Physics",
    experience: "10 years",
    fee: 450,
    city: "Addis Ababa",
    rating: 4.9,
    isAvailable: true
  },
  {
    name: "Dr. Hanna Gebre",
    subject: "Chemistry",
    gradeLevel: "Grade 11-12",
    qualification: "PhD in Chemistry",
    experience: "10 years",
    fee: 500,
    city: "Addis Ababa",
    rating: 4.95,
    isAvailable: true
  },
  {
    name: "Teacher Tekle Berhan",
    subject: "Amharic",
    gradeLevel: "Grade 5-8",
    qualification: "BA in Amharic",
    experience: "15 years",
    fee: 300,
    city: "Addis Ababa",
    rating: 4.85,
    isAvailable: true
  }
];

const getTutors = async (req, res) => {
  try {
    const { subject, gradeLevel } = req.query;
    let query = { isAvailable: true };
    
    if (subject && subject !== '') {
      query.subject = subject;
    }
    if (gradeLevel && gradeLevel !== '') {
      query.gradeLevel = gradeLevel;
    }
    
    let tutors = await Tutor.find(query);
    
    // If no tutors found, return sample tutors
    if (tutors.length === 0) {
      let filteredSamples = sampleTutors;
      if (subject && subject !== '') {
        filteredSamples = sampleTutors.filter(t => t.subject === subject);
      }
      if (gradeLevel && gradeLevel !== '') {
        filteredSamples = filteredSamples.filter(t => t.gradeLevel === gradeLevel);
      }
      return res.json({ success: true, data: filteredSamples });
    }
    
    res.json({ success: true, data: tutors });
  } catch (error) {
    console.error('Error fetching tutors:', error);
    // Return sample tutors on error
    res.json({ success: true, data: sampleTutors });
  }
};

const getAllTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find({ isAvailable: true });
    res.json({ success: true, data: tutors });
  } catch (error) {
    res.json({ success: true, data: sampleTutors });
  }
};

module.exports = { getTutors, getAllTutors };