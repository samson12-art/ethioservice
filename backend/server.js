const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/ethioservice')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// ==================== MODELS ====================

const userSchema = new mongoose.Schema({
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
  description: String
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

const serviceSchema = new mongoose.Schema({
  title: String,
  category: String,
  price: Number,
  rating: { type: Number, default: 4.5 },
  city: String
});

const Service = mongoose.model('Service', serviceSchema);

const doctorSchema = new mongoose.Schema({
  name: String,
  specialtyName: String,
  hospital: String,
  fee: Number,
  rating: { type: Number, default: 4.5 },
  city: String
});

const Doctor = mongoose.model('Doctor', doctorSchema);

const tutorSchema = new mongoose.Schema({
  name: String,
  subject: String,
  level: String,
  fee: Number,
  rating: { type: Number, default: 4.5 },
  experience: String,
  city: String,
  online: { type: Boolean, default: true },
  inperson: { type: Boolean, default: true }
});

const Tutor = mongoose.model('Tutor', tutorSchema);

const bookingSchema = new mongoose.Schema({
  serviceType: String,
  itemId: String,
  itemName: String,
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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

const Booking = mongoose.model('Booking', bookingSchema);

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  method: String,
  status: String,
  transactionId: String,
  phoneNumber: String,
  email: String,
  paymentType: { type: String, enum: ['upfront', 'remaining'] },
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  professionalId: String,
  professionalType: String,
  rating: Number,
  comment: String
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  read: { type: Boolean, default: false }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

// ==================== MIDDLEWARE ====================

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ethioservice_secret');
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin only' });
  }
  next();
};

// ==================== AUTH ROUTES ====================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, city } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User exists' });
    }
    const user = await User.create({ name, email, password, phone, city, role: 'customer' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'ethioservice_secret', { expiresIn: '30d' });
    res.json({ success: true, token, user: { id: user._id, name, email, role: 'customer', phone, city } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/register-provider', async (req, res) => {
  try {
    const { name, email, password, phone, city, profession, experience, price, priceUnit, description } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User exists' });
    }
    const user = await User.create({ name, email, password, phone, city, role: 'provider', profession, experience, price, priceUnit, description, isVerified: false });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'ethioservice_secret', { expiresIn: '30d' });
    res.json({ success: true, token, user: { id: user._id, name, email, role: 'provider', phone, city, isVerified: false } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'ethioservice_secret', { expiresIn: '30d' });
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, city: user.city, isVerified: user.isVerified } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.get('/api/auth/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// ==================== ADMIN ROUTES ====================

app.get('/api/admin/pending-providers', protect, adminOnly, async (req, res) => {
  const providers = await User.find({ role: 'provider', isVerified: false }).select('-password');
  res.json({ success: true, data: providers });
});

app.put('/api/admin/verify-provider/:id', protect, adminOnly, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isVerified: true });
  res.json({ success: true });
});

app.get('/api/admin/stats', protect, adminOnly, async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProviders = await User.countDocuments({ role: 'provider' });
  const pendingProviders = await User.countDocuments({ role: 'provider', isVerified: false });
  const totalBookings = await Booking.countDocuments();
  const payments = await Payment.find();
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  res.json({ success: true, data: { totalUsers, totalProviders, pendingProviders, totalBookings, totalRevenue } });
});

// ==================== SERVICES ROUTES ====================

app.get('/api/services/doctors', async (req, res) => {
  const doctors = await Doctor.find();
  if (doctors.length === 0) {
    res.json({ success: true, data: [
      { _id: '1', name: 'Dr. Abeba Tekle', specialtyName: 'General Physician', hospital: 'Black Lion Hospital', fee: 800, rating: 4.9, city: 'Addis Ababa' },
      { _id: '2', name: 'Dr. Tedros Adhanom', specialtyName: 'Cardiologist', hospital: 'St. Paul Hospital', fee: 1200, rating: 4.95, city: 'Addis Ababa' }
    ]});
  } else {
    res.json({ success: true, data: doctors });
  }
});

app.get('/api/services', async (req, res) => {
  const services = await Service.find();
  if (services.length === 0) {
    res.json({ success: true, data: [
      { _id: 's1', title: 'Plumbing Service', category: 'plumber', price: 500, rating: 4.8, city: 'Addis Ababa' },
      { _id: 's2', title: 'Electrical Service', category: 'electrician', price: 450, rating: 4.9, city: 'Addis Ababa' },
      { _id: 's3', title: 'Cleaning Service', category: 'cleaner', price: 400, rating: 4.7, city: 'Addis Ababa' }
    ]});
  } else {
    res.json({ success: true, data: services });
  }
});

app.get('/api/tutors', async (req, res) => {
  const { subject, level } = req.query;
  let tutors = await Tutor.find();
  if (tutors.length === 0) {
    tutors = [
      { _id: 't1', name: 'Dr. Alemu Tesfaye', subject: 'Mathematics', level: 'High School', fee: 400, rating: 4.9, experience: '12 years', city: 'Addis Ababa', online: true, inperson: true }
    ];
  }
  if (subject) tutors = tutors.filter(t => t.subject === subject);
  if (level) tutors = tutors.filter(t => t.level === level);
  res.json({ success: true, data: tutors });
});

// ==================== BOOKING ROUTES WITH 5.95% UPFRONT + 94.05% REMAINING ====================

app.post('/api/bookings/calculate', protect, async (req, res) => {
  try {
    const { serviceType, itemId, bookingDate, time, bookingMode } = req.body;
    
    let item = null;
    let totalPrice = 0;
    let itemName = '';
    
    if (serviceType === 'doctor') {
      const doctors = await Doctor.find();
      item = doctors.find(d => d._id.toString() === itemId);
      if (!item) item = { name: 'Doctor', fee: 800 };
      totalPrice = item.fee || 800;
      itemName = item.name;
    } else if (serviceType === 'service') {
      const services = await Service.find();
      item = services.find(s => s._id.toString() === itemId);
      if (!item) item = { title: 'Service', price: 500 };
      totalPrice = item.price || 500;
      itemName = item.title;
    } else if (serviceType === 'tutor') {
      const tutors = await Tutor.find();
      item = tutors.find(t => t._id.toString() === itemId);
      if (!item) item = { name: 'Tutor', fee: 400 };
      totalPrice = item.fee || 400;
      itemName = item.name;
    }
    
    const serviceFee = totalPrice * 0.0095;
    const guaranteeFee = totalPrice * 0.05;
    const upfrontAmount = totalPrice * 0.0595;
    const remainingAmount = totalPrice - upfrontAmount;
    
    const booking = await Booking.create({
      serviceType,
      itemId,
      itemName,
      customerId: req.user._id,
      bookingDate: new Date(bookingDate),
      time,
      totalPrice: totalPrice,
      serviceFee: serviceFee,
      guaranteeFee: guaranteeFee,
      upfrontAmount: upfrontAmount,
      remainingAmount: remainingAmount,
      bookingMode: bookingMode || 'online',
      status: 'pending_payment'
    });
    
    res.json({ 
      success: true, 
      data: {
        bookingId: booking._id,
        totalPrice: Math.round(totalPrice),
        serviceFee: Math.round(serviceFee),
        guaranteeFee: Math.round(guaranteeFee),
        upfrontAmount: Math.round(upfrontAmount),
        remainingAmount: Math.round(remainingAmount),
        itemName
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.post('/api/payments/initiate', protect, async (req, res) => {
  try {
    const { bookingId, method, phoneNumber, email } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    if (booking.status !== 'pending_payment') {
      return res.status(400).json({ success: false, message: 'Payment already processed' });
    }
    
    const transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8).toUpperCase();
    
    await Payment.create({
      bookingId,
      userId: req.user._id,
      amount: booking.upfrontAmount,
      method,
      status: 'completed',
      transactionId,
      phoneNumber,
      email,
      paymentType: 'upfront'
    });
    
    booking.paymentMethod = method;
    booking.paymentId = transactionId;
    booking.status = 'confirmed';
    booking.upfrontPaid = true;
    await booking.save();
    
    res.json({ 
      success: true, 
      message: `✅ Upfront payment of ${Math.round(booking.upfrontAmount)} Br successful! Booking confirmed. Remaining ${Math.round(booking.remainingAmount)} Br to be paid after service completion.`,
      data: {
        bookingId: booking._id,
        transactionId,
        upfrontAmount: booking.upfrontAmount,
        remainingAmount: booking.remainingAmount,
        method
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.post('/api/bookings/complete/:bookingId', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    if (booking.status !== 'confirmed') {
      return res.status(400).json({ success: false, message: 'Booking not confirmed yet' });
    }
    
    booking.status = 'completed';
    booking.completedAt = new Date();
    await booking.save();
    
    res.json({ 
      success: true, 
      message: `Service completed! Please pay remaining ${Math.round(booking.remainingAmount)} Br to the service provider.`,
      data: {
        bookingId: booking._id,
        remainingAmount: booking.remainingAmount
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.post('/api/payments/remaining', protect, async (req, res) => {
  try {
    const { bookingId, method, phoneNumber, email } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    if (booking.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Service not completed yet' });
    }
    
    if (booking.remainingPaid) {
      return res.status(400).json({ success: false, message: 'Remaining payment already processed' });
    }
    
    const transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8).toUpperCase();
    
    await Payment.create({
      bookingId,
      userId: req.user._id,
      amount: booking.remainingAmount,
      method,
      status: 'completed',
      transactionId,
      phoneNumber,
      email,
      paymentType: 'remaining'
    });
    
    booking.remainingPaid = true;
    booking.status = 'fully_paid';
    await booking.save();
    
    res.json({ 
      success: true, 
      message: `✅ Remaining payment of ${Math.round(booking.remainingAmount)} Br successful! Booking fully paid.`,
      data: {
        bookingId: booking._id,
        transactionId,
        remainingAmount: booking.remainingAmount
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.get('/api/bookings/my-bookings', protect, async (req, res) => {
  const bookings = await Booking.find({ customerId: req.user._id }).sort('-createdAt');
  res.json({ success: true, data: bookings });
});

// ==================== REVIEW ROUTES ====================

app.post('/api/reviews', protect, async (req, res) => {
  try {
    const { professionalId, professionalType, rating, comment } = req.body;
    const review = await Review.create({
      userId: req.user._id,
      userName: req.user.name,
      professionalId,
      professionalType,
      rating,
      comment
    });
    res.json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.get('/api/reviews/my-reviews', protect, async (req, res) => {
  const reviews = await Review.find({ userId: req.user._id }).sort('-createdAt');
  res.json({ success: true, data: reviews });
});

// ==================== PAYMENT HISTORY ====================

app.get('/api/payments/history', protect, async (req, res) => {
  const payments = await Payment.find({ userId: req.user._id }).sort('-createdAt');
  res.json({ success: true, data: payments });
});

// ==================== MESSAGE ROUTES ====================

app.post('/api/messages/send', protect, async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const newMessage = await Message.create({ senderId: req.user._id, receiverId, message });
    res.json({ success: true, data: newMessage });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.get('/api/messages/conversations', protect, async (req, res) => {
  const messages = await Message.find({ $or: [{ senderId: req.user._id }, { receiverId: req.user._id }] }).sort('-createdAt');
  res.json({ success: true, data: messages });
});

app.get('/api/messages/unread', protect, async (req, res) => {
  const unreadCount = await Message.countDocuments({ receiverId: req.user._id, read: false });
  res.json({ unreadCount });
});

// ==================== NEARBY ROUTES ====================

app.get('/api/nearby', async (req, res) => {
  try {
    res.json({ success: true, data: [] });
  } catch (error) {
    res.json({ success: true, data: [] });
  }
});

// ==================== TEST ROUTE ====================

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// ==================== START SERVER ====================

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});