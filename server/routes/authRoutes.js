const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'gh_default_secret_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

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
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
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
    const isMasterCredentials =
      cleanEmail === 'graphicshaven4@gmail.com' && password === 'Unicorn@1891';

    // 1. If MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      let admin = await Admin.findOne({ email: cleanEmail });

      // Auto-provision master admin in database if missing
      if (!admin && isMasterCredentials) {
        try {
          admin = await Admin.create({
            name: 'Studio Creative Director',
            email: cleanEmail,
            password: 'Unicorn@1891',
            role: 'superadmin',
          });
        } catch (seedErr) {
          console.warn('[Admin Seed Warning]:', seedErr.message);
        }
      }

      if (admin) {
        const isMatch = await admin.comparePassword(password);
        if (isMatch || isMasterCredentials) {
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
      }
    }

    // 2. In-memory fallback / master credentials check
    const inMemAdmin = inMemoryAdmins.find((a) => a.email === cleanEmail);
    if (inMemAdmin) {
      const isMatch = await bcrypt.compare(password, inMemAdmin.passwordHash);
      if (isMatch || isMasterCredentials) {
        const token = generateToken(inMemAdmin._id);
        return res.status(200).json({
          success: true,
          message: 'Admin login successful',
          data: {
            _id: inMemAdmin._id,
            name: inMemAdmin.name,
            email: inMemAdmin.email,
            role: inMemAdmin.role,
            token,
          },
        });
      }
    }

    // 3. Fallback direct check for master admin credentials
    if (isMasterCredentials) {
      const token = generateToken('gh-admin-001');
      return res.status(200).json({
        success: true,
        message: 'Admin login successful',
        data: {
          _id: 'gh-admin-001',
          name: 'Studio Creative Director',
          email: cleanEmail,
          role: 'superadmin',
          token,
        },
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
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
