const User = require('../models/user.model');

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch users', error });
  }
};

// GET /api/admin/transactions
const getAllTransactions = async (req, res) => {
  
};

// POST /api/admin/user/:id/block
const blockUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = true;
    await user.save();

    return res.status(200).json({ message: 'User blocked successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to block user', error });
  }
};

// GET /api/admin/reports
const generateReports = async (req, res) => {

};

module.exports = {
  getAllUsers,
  getAllTransactions,
  blockUser,
  generateReports
};