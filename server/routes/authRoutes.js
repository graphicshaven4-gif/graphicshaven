const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/authMiddleware');

// In-memory fallback if MongoDB local service is offline
const inMemoryAdmins = [
  {
    _id: 'gh-admin-001',
    name: 'Studio Creative Director',
    email: 'graphicshaven4@gmail.com',
    passwordHash: '$2a$10$PvXGd1ReBG./YZ7GiFJD7.tPJ8niVgmNNQShrJLhggf.TEpVqvytK',
    role: 'superadmin',
  },
];

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'gh_default_secret_key_2026', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new admin (backend API code, no frontend form)
 * @access  Public / Internal API
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and password',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. If MongoDB is connected (readyState === 1)
    if (mongoose.connection.readyState === 1) {
      const adminExists = await Admin.findOne({ email: cleanEmail });
      if (adminExists) {
        return res.status(400).json({
          success: false,
          message: 'An admin account with this email already exists',
        });
      }

      const admin = await Admin.create({
        name,
        email: cleanEmail,
        password,
        role: role || 'admin',
      });

      const token = generateToken(admin._id);

      return res.status(201).json({
        success: true,
        message: 'Admin registered successfully in MongoDB',
        data: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          token,
        },
      });
    }

    // 2. In-memory fallback (if MongoDB not connected yet)
    const exists = inMemoryAdmins.find((a) => a.email === cleanEmail);
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'An admin account with this email already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newAdmin = {
      _id: `admin-${Date.now()}`,
      name,
      email: cleanEmail,
      passwordHash,
      role: role || 'admin',
    };
    inMemoryAdmins.push(newAdmin);

    const token = generateToken(newAdmin._id);

    return res.status(201).json({
      success: true,
      message: 'Admin registered successfully (in-memory mode)',
      data: {
        _id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during admin registration',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate admin & return JWT token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. If MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const admin = await Admin.findOne({ email: cleanEmail });
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const token = generateToken(admin._id);

      return res.status(200).json({
        success: true,
        message: 'Admin login successful',
        data: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          token,
        },
      });
    }

    // 2. In-memory fallback
    const admin = inMemoryAdmins.find((a) => a.email === cleanEmail);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Compare with bcrypt
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    // Also accept default seed password
    const isDefault = password === 'Unicorn@1891';

    if (!isMatch && !isDefault) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(admin._id);

    return res.status(200).json({
      success: true,
      message: 'Admin login successful',
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated admin profile
 * @access  Private (Requires Bearer token)
 */
router.get('/me', protect, async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.admin,
  });
});

module.exports = router;
