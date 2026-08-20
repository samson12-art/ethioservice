const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB, sequelize } = require('../backend/config/database');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', require('../backend/routes/authRoutes'));
app.use('/api/admin', require('../backend/routes/adminRoutes'));
app.use('/api/services', require('../backend/routes/serviceRoutes'));
app.use('/api/tutors', require('../backend/routes/tutorRoutes'));
app.use('/api/bookings', require('../backend/routes/bookingRoutes'));
app.use('/api/payments', require('../backend/routes/paymentRoutes'));
app.use('/api/messages', require('../backend/routes/messageRoutes'));
app.use('/api/reviews', require('../backend/routes/reviewRoutes'));
app.use('/api/ratings', require('../backend/routes/ratingRoutes'));
app.use('/api/nearby', require('../backend/routes/nearbyRoutes'));
app.use('/api/lists', require('../backend/routes/lists'));
app.use('/api/complaints', require('../backend/routes/complaintRoutes'));

app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    });
  }
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

connectDB().catch(() => {});

module.exports = app;
