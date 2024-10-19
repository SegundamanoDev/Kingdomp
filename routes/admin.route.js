const express = require('express');
const { getAllUsers, getAllTransactions, blockUser, generateReports } = require('../controllers/admin.controller'); // Import the admin controller functions

const adminMiddleware = require('../middleware/admin.middleware');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Route to get all users (admin only)
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);

// Route to get all transactions (admin only)
router.get('/transactions', authMiddleware, adminMiddleware, getAllTransactions);

// Route to block a user (admin only)
router.post('/user/:id/block', authMiddleware, adminMiddleware, blockUser);

// Route to generate reports (admin only)
router.get('/reports', authMiddleware, adminMiddleware, generateReports);

module.exports = router;