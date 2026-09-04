const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { connectDB, sequelize } = require('./config/database');
const logger = require('./config/logger');

const app = express();

// Security headers
app.use(helmet());

// Rate limiting
const isDev = process.env.NODE_ENV !== 'production';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 1000 : 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 200 : 20,
  message: { success: false, message: 'Too many auth attempts, please try again later.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/register-provider', authLimiter);

// CORS
const corsOrigin = process.env.CORS_ORIGIN || '*';
const allowedOrigins = corsOrigin === '*' ? '*' : corsOrigin.split(',').map(s => s.trim());
app.use(cors({
  origin(origin, callback) {
    // Allow requests with no origin (curl, server-to-server) and credentials
    if (!origin || allowedOrigins === '*' || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Serve uploaded files with auth check
const { protect } = require('./middleware/auth');
app.use('/uploads', protect, express.static(path.join(__dirname, 'uploads')));

// Connect to database (non-blocking for serverless)
connectDB().catch((err) => {
  console.error('DB connection failed:', err.message);
});

// Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const tutorRoutes = require('./routes/tutorRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const nearbyRoutes = require('./routes/nearbyRoutes');
const listRoutes = require('./routes/lists');
const complaintRoutes = require('./routes/complaintRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/nearby', nearbyRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/complaints', complaintRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`${err.method || 'GET'} ${req.originalUrl} - ${err.message}`);
  if (err.name === 'MulterError') {
    return res.status(400).json({ success: false, message: `File upload error: ${err.message}` });
  }
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Only start server when run directly (not when imported by Vercel)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });

  const gracefulShutdown = async (signal) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);
    server.close(async () => {
      logger.info('HTTP server closed');
      try {
        await sequelize.close();
        logger.info('Database connection closed');
      } catch (err) {
        logger.error('Error closing database:', err);
      }
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err);
  });
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    gracefulShutdown('uncaughtException');
  });
} else {
  // In serverless, handle unhandled rejections without exiting
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
  });
}

module.exports = app;
