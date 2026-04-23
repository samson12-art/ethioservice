const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Service = require('./models/Service');
const Doctor = require('./models/Doctor');

dotenv.config();

mongoose.connect('mongodb://127.0.0.1:27017/ethioservice');

const seedData = async () => {
  try {
    // Clear existing data
    await Service.deleteMany();
    await Doctor.deleteMany();

    // Find or create a provider user
    let provider = await User.findOne({ role: 'provider' });
    if (!provider) {
      provider = await User.create({
        name: 'Tadesse Bekele',
        email: 'tadesse@ethioservice.com',
        password: 'password123',
        role: 'provider',
        phone: '0912345678',
        city: 'Addis Ababa'
      });
      console.log('Provider created:', provider.name);
    }

    // Add sample services
    const services = [
      {
        title: 'Emergency Plumber',
        category: 'plumber',
        description: '24/7 emergency plumbing services in Addis Ababa',
        price: 500,
        priceUnit: 'hour',
        city: 'Addis Ababa',
        provider: provider._id,
        rating: 4.8
      },
      {
        title: 'Certified Electrician',
        category: 'electrician',
        description: 'Electrical repairs and installation',
        price: 450,
        priceUnit: 'hour',
        city: 'Addis Ababa',
        provider: provider._id,
        rating: 4.9
      },
      {
        title: 'Math Tutoring',
        category: 'tutor',
        description: 'Expert math tutor for all levels',
        price: 300,
        priceUnit: 'hour',
        city: 'Bahir Dar',
        provider: provider._id,
        rating: 4.9
      },
      {
        title: 'Professional Cleaner',
        category: 'cleaner',
        description: 'Deep cleaning for homes and offices',
        price: 400,
        priceUnit: 'hour',
        city: 'Addis Ababa',
        provider: provider._id,
        rating: 4.7
      }
    ];

    await Service.insertMany(services);
    console.log(`✅ Added ${services.length} services`);

    // Add sample doctors
    const doctors = [
      {
        name: 'Dr. Tedros Adhanom',
        specialty: 'general',
        specialtyName: 'General Physician',
        experience: '18 years',
        hospital: 'Black Lion Hospital',
        fee: 800,
        city: 'Addis Ababa',
        rating: 4.9,
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      {
        name: 'Dr. Mekdes Daba',
        specialty: 'cardiology',
        specialtyName: 'Cardiologist',
        experience: '12 years',
        hospital: 'St. Paul\'s Hospital',
        fee: 1200,
        city: 'Addis Ababa',
        rating: 4.95,
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
      },
      {
        name: 'Dr. Atsede Asrat',
        specialty: 'gynecology',
        specialtyName: 'Gynecologist',
        experience: '15 years',
        hospital: 'Gandhi Hospital',
        fee: 900,
        city: 'Addis Ababa',
        rating: 4.85,
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
      }
    ];

    await Doctor.insertMany(doctors);
    console.log(`✅ Added ${doctors.length} doctors`);

    console.log('🎉 Data seeding completed!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();