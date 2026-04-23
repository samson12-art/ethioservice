const Booking = require('../models/Booking');

// Process Telebirr payment
const processTelebirrPayment = async (req, res) => {
  try {
    const { bookingId, phoneNumber } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Simulate Telebirr API call
    const transactionId = 'TEL_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
    
    booking.paymentMethod = 'telebirr';
    booking.paymentStatus = 'paid';
    booking.paymentId = transactionId;
    booking.paymentDate = new Date();
    booking.customerPhone = phoneNumber;
    booking.status = 'confirmed';
    await booking.save();
    
    res.json({ 
      success: true, 
      message: '✅ Telebirr payment successful!',
      transactionId,
      booking 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Process Chapa payment
const processChapaPayment = async (req, res) => {
  try {
    const { bookingId, email } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Simulate Chapa API call
    const transactionId = 'CHAPA_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
    
    booking.paymentMethod = 'chapa';
    booking.paymentStatus = 'paid';
    booking.paymentId = transactionId;
    booking.paymentDate = new Date();
    booking.customerEmail = email;
    booking.status = 'confirmed';
    await booking.save();
    
    res.json({ 
      success: true, 
      message: '✅ Chapa payment successful!',
      transactionId,
      booking 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Process Cash payment
const processCashPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    booking.paymentMethod = 'cash';
    booking.paymentStatus = 'pending';
    booking.status = 'confirmed';
    await booking.save();
    
    res.json({ 
      success: true, 
      message: '✅ Booking confirmed! Pay cash to the service provider.',
      booking 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get payment status
const getPaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    
    res.json({ 
      success: true, 
      paymentStatus: booking.paymentStatus,
      paymentMethod: booking.paymentMethod,
      amount: booking.totalPrice,
      transactionId: booking.paymentId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  processTelebirrPayment, 
  processChapaPayment, 
  processCashPayment,
  getPaymentStatus 
};