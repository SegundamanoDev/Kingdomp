const jwt = require('jsonwebtoken');
const  User  = require('../models/user.model');

const adminMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by userId
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    if(!user.isAdmin){
        return res.status(401).json({ message: 'Only an admin can access this route' })
    }
    // Continue to the next middleware
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = adminMiddleware;