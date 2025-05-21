// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header is present and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]; // Extract the token part

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to the request object (without the password)
      // This makes the user's ID available in subsequent route handlers
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move to the next middleware/route handler
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };