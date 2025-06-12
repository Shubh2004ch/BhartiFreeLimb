const express = require('express');
const router = express.Router();
const authController = require('../../controllers/public/authController');
const auth = require('../../middleware/auth');

// Login route
router.post('/login', authController.login);

// Get current admin route
router.get('/me', auth, authController.getCurrentAdmin);

module.exports = router; 