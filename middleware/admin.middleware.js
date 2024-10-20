const adminMiddleware = async (req, res, next) => {
  try {
   const user = req.user

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    if(!user.isAdmin){
        return res.status(401).json({ message: 'Admin access required' })
    }
    // Continue to the next middleware
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = adminMiddleware;