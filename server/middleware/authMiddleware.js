const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'gh_default_secret_key_2026';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      // 1. Fallback admin or in-memory ID
      if (decoded.id === 'gh-admin-001' || !mongoose.isValidObjectId(decoded.id)) {
        req.admin = {
          _id: decoded.id,
          name: 'Studio Creative Director',
          email: 'graphicshaven4@gmail.com',
          role: 'superadmin',
        };
        return next();
      }

      // 2. MongoDB database lookup if connected
      if (mongoose.connection.readyState === 1) {
        req.admin = await Admin.findById(decoded.id).select('-password');
        if (!req.admin) {
          req.admin = {
            _id: decoded.id,
            name: 'Studio Creative Director',
            email: 'graphicshaven4@gmail.com',
            role: 'superadmin',
          };
        }
      } else {
        req.admin = {
          _id: decoded.id,
          name: 'Studio Creative Director',
          email: 'graphicshaven4@gmail.com',
          role: 'superadmin',
        };
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token verification failed',
        error: error.message,
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

module.exports = { protect };
