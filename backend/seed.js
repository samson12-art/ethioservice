const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/User');
const Service = require('./models/Service');
const Doctor = require('./models/Doctor');
const { sequelize } = require('./config/database');

const seedData = async () => {
  try {
    await sequelize.sync({ force: true });

    // Create admin user
    let admin = await User.findOne({ where: { role: 'admin' } });
    if (!admin) {
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@ethioservice.com',
        password: 'admin123',
        role: 'admin',
        phone: '0911000000',
        city: 'Addis Ababa'
      });
      console.log('Admin created:', admin.email, '/ password: admin123');
    }

    // Create a provider user
    let provider = await User.findOne({ where: { role: 'provider' } });
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

    // Create a customer user
    let customer = await User.findOne({ where: { email: 'customer@ethioservice.com' } });
    if (!customer) {
      customer = await User.create({
        name: 'Demo Customer',
        email: 'customer@ethioservice.com',
        password: 'customer123',
        role: 'customer',
        phone: '0922000000',
        city: 'Addis Ababa'
      });
      console.log('Customer created:', customer.email, '/ password: customer123');
    }

    // Add sample services
    const services = [
      {
        title: 'Emergency Plumber',
        category: 'plumber',
        price: 500,
        rating: 4.8,
        city: 'Addis Ababa'
      },
      {
        title: 'Certified Electrician',
        category: 'electrician',
        price: 450,
        rating: 4.9,
        city: 'Addis Ababa'
      },
      {
        title: 'Math Tutoring',
        category: 'tutor',
        price: 300,
        rating: 4.9,
        city: 'Bahir Dar'
      },
      {
        title: 'Professional Cleaner',
        category: 'cleaner',
        price: 400,
        rating: 4.7,
        city: 'Addis Ababa'
      }
    ];

    await Service.bulkCreate(services);
    console.log(`✅ Added ${services.length} services`);

    // Add sample doctors
    const doctors = [
      {
        name: 'Dr. Tedros Adhanom',
        specialtyName: 'General Physician',
        experience: '18 years',
        hospital: 'Black Lion Hospital',
        fee: 800,
        city: 'Addis Ababa',
        rating: 4.9
      },
      {
        name: 'Dr. Mekdes Daba',
        specialtyName: 'Cardiologist',
        experience: '12 years',
        hospital: 'St. Paul\'s Hospital',
        fee: 1200,
        city: 'Addis Ababa',
        rating: 4.95
      },
      {
        name: 'Dr. Atsede Asrat',
        specialtyName: 'Gynecologist',
        experience: '15 years',
        hospital: 'Gandhi Hospital',
        fee: 900,
        city: 'Addis Ababa',
        rating: 4.85
      }
    ];

    await Doctor.bulkCreate(doctors);
    console.log(`✅ Added ${doctors.length} doctors`);

    console.log('🎉 Data seeding completed!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
