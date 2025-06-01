const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const findAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Find all admin users
    console.log('Finding admin users...');
    const admins = await Admin.find().select('-password');
    
    console.log('Found admin users:', admins);
    process.exit(0);
  } catch (error) {
    console.error('Error finding admin:', error);
    process.exit(1);
  }
};

findAdmin(); 