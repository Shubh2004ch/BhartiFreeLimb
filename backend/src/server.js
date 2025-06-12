require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Global error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  // Give the server time to log the error before exiting
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
});

// Set default JWT_SECRET if not set
if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET not found in environment, using default secret. Please set JWT_SECRET in production.');
  process.env.JWT_SECRET = 'bharti_freelimbs_jwt_secret_2024';
}

// Debug environment variables (excluding sensitive data)
console.log('Environment Configuration:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MongoDB Connection:', process.env.MONGODB_URI ? 'Configured' : 'Not Configured');
console.log('AWS Configuration:', {
  region: process.env.AWS_REGION || 'Not Set',
  bucketName: process.env.AWS_BUCKET_NAME || 'Not Set',
  hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
  hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
});

const centerRoutes = require('./routes/centerRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const reviewRoutes = require('./routes/public/reviewRoutes');
const successStoryRoutes = require('./routes/public/successStoryRoutes');
const foodStallRoutes = require('./routes/foodStallRoutes');
const clinicRoutes = require('./routes/clinicRoutes');
const sleepingBagRoutes = require('./routes/sleepingBagRoutes');
const waterPonds = require('./routes/public/waterPonds');
const shelterRoutes = require('./routes/shelters');
const authRoutes = require('./routes/public/auth');
const connectDB = require('./config/database');

const app = express();

// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      "*",
      'https://www.bharti-freelimbs.com',
      'https://bharti-freelimbs.com',
      'https://bhartifreelimb-production.up.railway.app',
      'https://bhartifreelimb.vercel.app',
      'http://localhost:3000',
      'http://localhost:33927',
      'http://localhost:41691'
    ] 
  : ['http://localhost:3000', 'http://localhost:33927', /^http:\/\/localhost:\d+$/];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin matches any allowed origins
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      if (allowedOrigin === '*') return true;
      return allowedOrigin === origin;
    });

    if (!isAllowed) {
      console.log('Blocked by CORS:', origin);
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error Handler:', err);
  console.error('Stack:', err.stack);
  
  // Handle multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      message: 'File upload error',
      error: err.message
    });
  }

  // Handle AWS errors
  if (err.name === 'CredentialsError' || err.message.includes('credentials')) {
    return res.status(500).json({
      message: 'AWS configuration error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }

  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

console.log("Connecting to MongoDB");
connectDB().catch(err => {
  console.error('MongoDB connection error:', err);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    aws: {
      configured: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY),
      region: process.env.AWS_REGION,
      bucket: process.env.AWS_BUCKET_NAME
    }
  });
});

// API Routes
app.use('/api/centers', centerRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/success-stories', successStoryRoutes);
app.use('/api/food-stalls', foodStallRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/sleepingbags', sleepingBagRoutes);
app.use('/api/waterponds', waterPonds);
app.use('/api/shelters', shelterRoutes);
app.use('/api/auth', authRoutes);

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, '../../frontend/build')));

// Special handling for sitemap.xml and robots.txt
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.sendFile(path.join(__dirname, '../../frontend/build/sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.sendFile(path.join(__dirname, '../../frontend/build/robots.txt'));
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});

const PORT = process.env.NODE_ENV === 'production' ? (process.env.PORT || 5000) : 5001;

// Create HTTP server with error handling
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

server.on('error', (error) => {
  console.error('Server Error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
