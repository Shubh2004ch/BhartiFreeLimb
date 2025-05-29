require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const centerRoutes = require('./routes/centerRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const successStoryRoutes = require('./routes/successStoryRoutes');
const foodStallRoutes = require('./routes/foodStallRoutes');
const clinicRoutes = require('./routes/clinicRoutes');
const sleepingBagRoutes = require('./routes/sleepingBagRoutes');
const waterPondRoutes = require('./routes/waterPonds');
const shelterRoutes = require('./routes/shelters');
const authRoutes = require('./routes/auth');
const connectDB = require('./config/database');

const app = express();

// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      "*",
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

console.log("Connecting to MongoDB");
connectDB();

// Create uploads folder if it doesn't exist
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('Created uploads folder');
}

// Serve static files from uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API Routes
app.use('/api/centers', centerRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/success-stories', successStoryRoutes);
app.use('/api/foodstalls', foodStallRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/sleepingbags', sleepingBagRoutes);
app.use('/api/waterponds', waterPondRoutes);
app.use('/api/shelters', shelterRoutes);
app.use('/api/auth', authRoutes);

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, '../../frontend/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});

const PORT = process.env.NODE_ENV === 'production' ? (process.env.PORT || 5000) : 5001;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
