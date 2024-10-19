const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const  User  = require('../models/user.model');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

// Create a nodemailer transporter for email sending
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// User Registration Controller
exports.registerUser = async (req, res) => {
  const { email, password, name, phone } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      userId: uuidv4(), 
      email,
      password: hashedPassword,
      name,
      balance: 0.0,
      phone: phone || undefined,
      biometricEnabled: false,
      twoFactorAuth: false,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
 console.log(newUser)
    // Generate a token for email confirmation
    const token = jwt.sign({ userId: newUser.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const confirmationUrl = `http://localhost:3000/api/auth/confirm/${token}`;

    // Send confirmation email
    await transporter.sendMail({
      to: newUser.email,
      subject: 'Confirm your email',
      html: `<p>Welcome to fintech platform, ${newUser.name}! Please confirm your email by clicking <a href="${confirmationUrl}">here</a>.</p>`,
    });

    res.status(201).json({
      message: 'User registered successfully, please check your email to confirm.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Email Confirmation Controller
exports.confirmEmail = async (req, res) => {
  const { token } = req.params;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by userId
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(400).json({ message: 'Invalid token or user does not exist' });
    }

    // Update user status to confirmed
    user.isConfirmed = true;
    await user.save();

    res.status(200).json({ message: 'Email confirmed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to confirm email' });
  }
};

// Login Controller
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    // Check if user is confirmed
    if (!user.isConfirmed) {
      return res.status(400).json({ message: 'Please confirm your email before logging in' });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};