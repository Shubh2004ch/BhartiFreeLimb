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
  ? ['https://bharti.up.railway.app', 'https://bharti-frontend.up.railway.app'] 
  : ['http://localhost:3000', 'https://a347-2405-204-320a-9c44-4a0e-effb-429c-e015.ngrok-free.app'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

console.log("Connecting to MongoDB");

// Create uploads folder if it doesn't exist
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('Created uploads folder');
}

// Serve static files from uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
connectDB();
