require('dotenv').config();
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
const allowedOrigins = [
  'http://localhost:3000',
  'https://a347-2405-204-320a-9c44-4a0e-effb-429c-e015.ngrok-free.app'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
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

// Add a test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.listen(5000, () => console.log('Server running on port 5000'));
connectDB();
