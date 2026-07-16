const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/User');
const Service = require('./models/Service');
const Doctor = require('./models/Doctor');
const Tutor = require('./models/Tutor');
const { sequelize } = require('./config/database');

const seedData = async () => {
  try {
    await sequelize.sync({ force: true });

    let admin = await User.findOne({ where: { role: 'admin' } });
    if (!admin) {
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@ethioservice.com',
        password: 'Admin@2024!',
        role: 'admin',
        phone: '0911000000',
        city: 'Addis Ababa'
      });
      console.log('Admin created:', admin.email, '/ password: Admin@2024!');
    }

    let provider = await User.findOne({ where: { role: 'provider' } });
    if (!provider) {
      provider = await User.create({
        name: 'Tadesse Bekele',
        email: 'tadesse@ethioservice.com',
        password: 'Provider@2024!',
        role: 'provider',
        phone: '0912345678',
        city: 'Addis Ababa',
        profession: 'Plumber',
        experience: '10 years',
        price: 500,
        priceUnit: 'hour',
        description: 'Experienced plumber with 10 years of professional service.',
        isVerified: true,
        certificateUrl: null,
        experienceLetterUrl: null,
        agreedToTerms: true
      });
      console.log('Provider created:', provider.name, '/ password: Provider@2024!');
    }

    let customer = await User.findOne({ where: { email: 'customer@ethioservice.com' } });
    if (!customer) {
      customer = await User.create({
        name: 'Demo Customer',
        email: 'customer@ethioservice.com',
        password: 'Customer@2024!',
        role: 'customer',
        phone: '0922000000',
        city: 'Addis Ababa'
      });
      console.log('Customer created:', customer.email, '/ password: Customer@2024!');
    }

    const services = [
      { title: 'Emergency Plumber', category: 'plumber', price: 500, rating: 4.8, city: 'Addis Ababa', providerId: provider.id.toString(), providerName: provider.name },
      { title: 'Certified Electrician', category: 'electrician', price: 450, rating: 4.9, city: 'Addis Ababa', providerId: provider.id.toString(), providerName: provider.name },
      { title: 'Math Tutoring', category: 'tutor', price: 300, rating: 4.9, city: 'Bahir Dar' },
      { title: 'Professional Cleaner', category: 'cleaner', price: 400, rating: 4.7, city: 'Addis Ababa' }
    ];
    await Service.bulkCreate(services);
    console.log(`Added ${services.length} services`);

    const doctors = [
      { name: 'Dr. Tedros Adhanom', specialtyName: 'General Physician', experience: '18 years', hospital: 'Black Lion Hospital', fee: 800, city: 'Addis Ababa', rating: 4.9 },
      { name: 'Dr. Mekdes Daba', specialtyName: 'Cardiologist', experience: '12 years', hospital: "St. Paul's Hospital", fee: 1200, city: 'Addis Ababa', rating: 4.95 },
      { name: 'Dr. Atsede Asrat', specialtyName: 'Gynecologist', experience: '15 years', hospital: 'Gandhi Hospital', fee: 900, city: 'Addis Ababa', rating: 4.85 }
    ];
    await Doctor.bulkCreate(doctors);
    console.log(`Added ${doctors.length} doctors`);

    const tutors = [
      { name: 'Dr. Alemu Tesfaye', subject: 'Mathematics', level: 'High School', fee: 400, rating: 4.9, experience: '12 years', city: 'Addis Ababa' },
      { name: 'Teacher Selamawit Mulugeta', subject: 'English', level: 'High School', fee: 350, rating: 4.8, experience: '8 years', city: 'Addis Ababa' },
      { name: 'Mr. Yonas Desta', subject: 'Physics', level: 'High School', fee: 450, rating: 4.9, experience: '10 years', city: 'Addis Ababa' }
    ];
    await Tutor.bulkCreate(tutors);
    console.log(`Added ${tutors.length} tutors`);

    console.log('Data seeding completed!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
