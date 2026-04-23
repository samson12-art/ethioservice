const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Doctor = require('../models/Doctor');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { serviceType, itemId, bookingDate, time } = req.body;
    
    console.log('📝 Creating booking:', { serviceType, itemId, userId: req.user._id });
    
    let provider, totalPrice;
    
    if (serviceType === 'service') {
      const service = await Service.findById(itemId);
      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }
      provider = service.provider || req.user._id;
      totalPrice = service.price;
    } else if (serviceType === 'doctor') {
      const doctor = await Doctor.findById(itemId);
      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }
      provider = doctor._id;
      totalPrice = doctor.fee;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid service type' });
    }
    
    const booking = await Booking.create({
      serviceType,
      itemId,
      customer: req.user._id,
      provider,
      bookingDate: new Date(bookingDate),
      time,
      totalPrice,
      status: 'pending',
      paymentStatus: 'pending'
    });
    
    console.log('✅ Booking created:', booking._id);
    
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error('❌ Booking error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('itemId')
      .sort('-createdAt');
    
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get provider's bookings
const getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.user._id })
      .populate('customer', 'name email phone')
      .sort('-createdAt');
    
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );
    
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add review for provider
const addProviderReview = async (req, res) => {
  try {
    const { bookingId, rating, review } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { 
        customerRating: rating,
        customerReview: review,
        reviewedAt: new Date()
      },
      { new: true }
    );
    
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { 
        status: 'cancelled',
        cancelledAt: new Date()
      },
      { new: true }
    );
    
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getProviderBookings,
  updateBookingStatus,
  addProviderReview,
  cancelBooking
};