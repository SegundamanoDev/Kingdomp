const express = require('express');
const { registerUser, loginUser, confirmEmail } = require('../controllers/auth.controller');

const router = express.Router();

// Register User Route
router.post('/register', registerUser);

// Login User Route
router.post('/login', loginUser);

// Email Confirmation Route
router.get('/confirm/:token', confirmEmail);

module.exports = router;