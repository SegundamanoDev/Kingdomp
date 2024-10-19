const User = require("../models/user.model");
const crypto = require('crypto');
const bcrypt = require ("bcrypt")
const { Op } = require('sequelize');
const { sendEmail } = require('../utils/sendEmail');

// GET /api/user/profile
const getUserProfile = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.status(200).json({ user });
};

// PUT /api/user/profile
const updateUserProfile = async (req, res) => {
  const user = req.user;
  const { name, phone } = req.body;

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  try {
    await User.update({ name, phone }, { where: { id: user.id } });
    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update profile', error });
  }
};

// GET /api/user/balance
const getUserBalance = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

//  THIS LOGIC IS ON PENDING UNTILL THE WALLET MODEL AND CONTROLLER IS CREATED
};


// Request Password Reset
 const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set token and expiration time (1 hour from now)
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiration

    await user.save();

    // Send reset link via email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `You requested a password reset. Click the link to reset your password: ${resetUrl}`;

    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message,
    });

    return res.status(200).json({ message: 'Password reset link sent to email' });
  } catch (error) {
    return res.status(500).json({ message: 'Error requesting password reset', error });
  }
};


// Reset Password
const resetPassword =  async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Hash the token to match with the database stored hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find the user by token and check if token has expired
    const user = await UserModel.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear reset token and expiry fields
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({ message: 'Password successfully reset' });
  } catch (error) {
    return res.status(500).json({ message: 'Error resetting password', error });
  }
};


module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserBalance,
  forgotPassword,
  resetPassword
};