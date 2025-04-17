const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Token doesn't exist
    if (!token) {
      return res.status(401).json({ msg: 'Not authorized, no token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Attach user to request
    req.user = {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expired' });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Middleware to verify admin role
exports.admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ msg: 'Not authorized as admin' });
  }
}; 