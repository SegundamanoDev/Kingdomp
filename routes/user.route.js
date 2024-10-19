const express = require('express');
const { getUserProfile, updateUserProfile, getUserBalance, resetPassword, forgotPassword } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Route to get user profile
router.get('/profile', authMiddleware, getUserProfile);

// Route to update user profile
router.put('/profile', authMiddleware, updateUserProfile);

// Route to get user balance
router.get('/balance', authMiddleware, getUserBalance);

// Route for forgot password
router.post('/forgot-password', authMiddleware, forgotPassword);

// Route to reset password
router.post('/reset-password/:token', authMiddleware, resetPassword);

module.exports = router;