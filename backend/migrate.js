const mongoose = require('mongoose');
const { sequelize } = require('./config/database');

// MongoDB Models (using existing schemas)
const mongoUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  city: String,
  role: { type: String, default: 'customer' },
  isVerified: { type: Boolean, default: false },
  profession: String,
  experience: String,
  price: Number,
  priceUnit: String,
  description: String,
  createdAt: Date,
  updatedAt: Date
});
const MongoUser = mongoose.model('MongoUser', mongoUserSchema, 'users');

const mongoServiceSchema = new mongoose.Schema({
  title: String,
  category: String,
  price: Number,
  rating: { type: Number, default: 4.5 },
  city: String,
  createdAt: Date,
  updatedAt: Date
});
const MongoService = mongoose.model('MongoService', mongoServiceSchema, 'services');

const mongoDoctorSchema = new mongoose.Schema({
  name: String,
  specialtyName: String,
  hospital: String,
  fee: Number,
  rating: { type: Number, default: 4.5 },
  city: String,
  createdAt: Date,
  updatedAt: Date
});
const MongoDoctor = mongoose.model('MongoDoctor', mongoDoctorSchema, 'doctors');

const mongoTutorSchema = new mongoose.Schema({
  name: String,
  subject: String,
  level: String,
  fee: Number,
  rating: { type: Number, default: 4.5 },
  experience: String,
  city: String,
  online: { type: Boolean, default: true },
  inperson: { type: Boolean, default: true },
  createdAt: Date,
  updatedAt: Date
});
const MongoTutor = mongoose.model('MongoTutor', mongoTutorSchema, 'tutors');

const mongoBookingSchema = new mongoose.Schema({
  serviceType: String,
  itemId: String,
  itemName: String,
  customerId: mongoose.Schema.Types.ObjectId,
  bookingDate: Date,
  time: String,
  totalPrice: Number,
  serviceFee: Number,
  guaranteeFee: Number,
  upfrontAmount: Number,
  remainingAmount: Number,
  bookingMode: String,
  status: { type: String, default: 'pending_payment' },
  paymentMethod: String,
  paymentId: String,
  upfrontPaid: { type: Boolean, default: false },
  remainingPaid: { type: Boolean, default: false },
  completedAt: Date,
  createdAt: { type: Date, default: Date.now }
});
const MongoBooking = mongoose.model('MongoBooking', mongoBookingSchema, 'bookings');

const mongoPaymentSchema = new mongoose.Schema({
  bookingId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  method: String,
  status: String,
  transactionId: String,
  phoneNumber: String,
  email: String,
  paymentType: String,
  createdAt: { type: Date, default: Date.now }
});
const MongoPayment = mongoose.model('MongoPayment', mongoPaymentSchema, 'payments');

const mongoReviewSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  userName: String,
  professionalId: String,
  professionalType: String,
  rating: Number,
  comment: String,
  createdAt: Date,
  updatedAt: Date
});
const MongoReview = mongoose.model('MongoReview', mongoReviewSchema, 'reviews');

const mongoMessageSchema = new mongoose.Schema({
  senderId: mongoose.Schema.Types.ObjectId,
  receiverId: mongoose.Schema.Types.ObjectId,
  message: String,
  read: { type: Boolean, default: false },
  createdAt: Date,
  updatedAt: Date
});
const MongoMessage = mongoose.model('MongoMessage', mongoMessageSchema, 'messages');

// PostgreSQL Models
const User = require('./models/User');
const Service = require('./models/Service');
const Doctor = require('./models/Doctor');
const Tutor = require('./models/Tutor');
const Booking = require('./models/Booking');
const Payment = require('./models/Payment');
const Review = require('./models/Review');
const Message = require('./models/Message');

const MONGO_URI = 'mongodb://127.0.0.1:27017/ethioservice';

const migrate = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');

    console.log('🔄 Connecting to PostgreSQL...');
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Connected');

    // Sync all PostgreSQL tables
    await sequelize.sync({ force: true });
    console.log('✅ PostgreSQL tables created');

    // 1. Migrate Users (bypass password hook since passwords are already hashed)
    console.log('\n📦 Migrating Users...');
    const mongoUsers = await MongoUser.find();
    for (const mu of mongoUsers) {
      const user = User.build({
        name: mu.name || '',
        email: mu.email || '',
        password: mu.password || '',
        phone: mu.phone || '',
        city: mu.city || '',
        role: mu.role || 'customer',
        isVerified: mu.isVerified || false,
        profession: mu.profession || '',
        experience: mu.experience || '',
        price: mu.price || 0,
        priceUnit: mu.priceUnit || '',
        description: mu.description || '',
        createdAt: mu.createdAt || new Date(),
        updatedAt: mu.updatedAt || new Date()
      });
      await user.save({ hooks: false });
    }
    console.log(`✅ Migrated ${mongoUsers.length} users`);

    // 2. Migrate Services
    console.log('\n📦 Migrating Services...');
    const mongoServices = await MongoService.find();
    for (const ms of mongoServices) {
      await Service.create({
        title: ms.title || '',
        category: ms.category || '',
        price: ms.price || 0,
        rating: ms.rating || 4.5,
        city: ms.city || '',
        createdAt: ms.createdAt || new Date(),
        updatedAt: ms.updatedAt || new Date()
      });
    }
    console.log(`✅ Migrated ${mongoServices.length} services`);

    // 3. Migrate Doctors
    console.log('\n📦 Migrating Doctors...');
    const mongoDoctors = await MongoDoctor.find();
    for (const md of mongoDoctors) {
      await Doctor.create({
        name: md.name || '',
        specialtyName: md.specialtyName || '',
        hospital: md.hospital || '',
        fee: md.fee || 0,
        rating: md.rating || 4.5,
        city: md.city || '',
        createdAt: md.createdAt || new Date(),
        updatedAt: md.updatedAt || new Date()
      });
    }
    console.log(`✅ Migrated ${mongoDoctors.length} doctors`);

    // 4. Migrate Tutors
    console.log('\n📦 Migrating Tutors...');
    const mongoTutors = await MongoTutor.find();
    for (const mt of mongoTutors) {
      await Tutor.create({
        name: mt.name || '',
        subject: mt.subject || '',
        level: mt.level || '',
        fee: mt.fee || 0,
        rating: mt.rating || 4.5,
        experience: mt.experience || '',
        city: mt.city || '',
        online: mt.online !== undefined ? mt.online : true,
        inperson: mt.inperson !== undefined ? mt.inperson : true,
        createdAt: mt.createdAt || new Date(),
        updatedAt: mt.updatedAt || new Date()
      });
    }
    console.log(`✅ Migrated ${mongoTutors.length} tutors`);

    // 5. Migrate Bookings
    console.log('\n📦 Migrating Bookings...');
    const mongoBookings = await MongoBooking.find();
    for (const mb of mongoBookings) {
      await Booking.create({
        serviceType: mb.serviceType || '',
        itemId: mb.itemId || '',
        itemName: mb.itemName || '',
        customerId: mb.customerId ? mb.customerId.toString() : null,
        bookingDate: mb.bookingDate || null,
        time: mb.time || '',
        totalPrice: mb.totalPrice || 0,
        serviceFee: mb.serviceFee || 0,
        guaranteeFee: mb.guaranteeFee || 0,
        upfrontAmount: mb.upfrontAmount || 0,
        remainingAmount: mb.remainingAmount || 0,
        bookingMode: mb.bookingMode || 'online',
        status: mb.status || 'pending_payment',
        paymentMethod: mb.paymentMethod || '',
        paymentId: mb.paymentId || '',
        upfrontPaid: mb.upfrontPaid || false,
        remainingPaid: mb.remainingPaid || false,
        completedAt: mb.completedAt || null,
        createdAt: mb.createdAt || new Date(),
        updatedAt: new Date()
      });
    }
    console.log(`✅ Migrated ${mongoBookings.length} bookings`);

    // 6. Migrate Payments
    console.log('\n📦 Migrating Payments...');
    const mongoPayments = await MongoPayment.find();
    for (const mp of mongoPayments) {
      await Payment.create({
        bookingId: mp.bookingId ? mp.bookingId.toString() : null,
        userId: mp.userId ? mp.userId.toString() : null,
        amount: mp.amount || 0,
        method: mp.method || '',
        status: mp.status || '',
        transactionId: mp.transactionId || '',
        phoneNumber: mp.phoneNumber || '',
        email: mp.email || '',
        paymentType: mp.paymentType || '',
        createdAt: mp.createdAt || new Date(),
        updatedAt: new Date()
      });
    }
    console.log(`✅ Migrated ${mongoPayments.length} payments`);

    // 7. Migrate Reviews
    console.log('\n📦 Migrating Reviews...');
    const mongoReviews = await MongoReview.find();
    for (const mr of mongoReviews) {
      await Review.create({
        userId: mr.userId ? mr.userId.toString() : null,
        userName: mr.userName || '',
        professionalId: mr.professionalId || '',
        professionalType: mr.professionalType || '',
        rating: mr.rating || 0,
        comment: mr.comment || '',
        createdAt: mr.createdAt || new Date(),
        updatedAt: mr.updatedAt || new Date()
      });
    }
    console.log(`✅ Migrated ${mongoReviews.length} reviews`);

    // 8. Migrate Messages
    console.log('\n📦 Migrating Messages...');
    const mongoMessages = await MongoMessage.find();
    for (const mm of mongoMessages) {
      await Message.create({
        senderId: mm.senderId ? mm.senderId.toString() : null,
        receiverId: mm.receiverId ? mm.receiverId.toString() : null,
        message: mm.message || '',
        read: mm.read || false,
        createdAt: mm.createdAt || new Date(),
        updatedAt: mm.updatedAt || new Date()
      });
    }
    console.log(`✅ Migrated ${mongoMessages.length} messages`);

    console.log('\n🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrate();
