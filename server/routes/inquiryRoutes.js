const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Inquiry = require('../models/Inquiry');
const { sendInquiryNotification } = require('../services/emailService');

// In-memory fallback inquiries if MongoDB is offline
let memoryInquiries = [
  {
    _id: 'inq-101',
    name: 'Sarah Jenkins',
    email: 'sarah@nordicliving.com',
    phone: '+1 (555) 234-5678',
    service: 'Brand Identity',
    budget: '$5k – $15k',
    details: 'Complete brand refresh for Scandinavian homeware store launch.',
    status: 'New',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'inq-102',
    name: 'Vikram Sundaram',
    email: 'vikram@chennaitech.io',
    phone: '+91 98401 23456',
    service: 'Web Development',
    budget: '$15k – $50k',
    details: 'Full-stack React & Node.js web application with dashboard.',
    status: 'In Review',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    _id: 'inq-103',
    name: 'Elena Rostova',
    email: 'elena@luxpackaging.fr',
    phone: '+33 1 42 68 55 00',
    service: 'Product Packaging Design',
    budget: '$5k – $15k',
    details: 'Luxury cosmetic carton boxes and foil stamping design.',
    status: 'Contacted',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Helper to check MongoDB connection state
const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * @route   POST /api/inquiries
 * @desc    Submit new client contact inquiry + trigger email notification
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service, budget, details } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required fields.',
      });
    }

    let savedInquiry;

    if (isDbConnected()) {
      savedInquiry = await Inquiry.create({
        name,
        email,
        phone,
        service: service || 'General Inquiry',
        budget: budget || 'Not specified',
        details: details || '',
        status: 'New',
      });
    } else {
      // In-memory fallback
      savedInquiry = {
        _id: `inq-${Date.now()}`,
        name,
        email,
        phone: phone || '',
        service: service || 'General Inquiry',
        budget: budget || 'Not specified',
        details: details || '',
        status: 'New',
        createdAt: new Date().toISOString(),
      };
      memoryInquiries.unshift(savedInquiry);
    }

    // Trigger email notification to studio
    const emailResult = await sendInquiryNotification(savedInquiry);

    return res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully! Our team will get in touch shortly.',
      data: savedInquiry,
      emailSent: emailResult.success,
    });
  } catch (err) {
    console.error('[Inquiry Error]', err);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while submitting your inquiry.',
      error: err.message,
    });
  }
});

/**
 * @route   GET /api/inquiries
 * @desc    Get all inquiries for Admin Panel
 * @access  Public / Admin
 */
router.get('/', async (req, res) => {
  try {
    let inquiries;

    if (isDbConnected()) {
      inquiries = await Inquiry.find().sort({ createdAt: -1 });
    } else {
      inquiries = memoryInquiries;
    }

    return res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (err) {
    console.error('[Inquiry Fetch Error]', err);
    return res.status(500).json({
      success: false,
      message: 'Could not fetch inquiries',
      data: memoryInquiries,
    });
  }
});

/**
 * @route   PATCH /api/inquiries/:id/status
 * @desc    Update inquiry status (New, In Review, Contacted)
 * @access  Admin
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['New', 'In Review', 'Contacted'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be New, In Review, or Contacted.',
      });
    }

    if (isDbConnected()) {
      const updated = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Inquiry not found' });
      }
      return res.status(200).json({ success: true, data: updated });
    } else {
      memoryInquiries = memoryInquiries.map((inq) =>
        inq._id === id ? { ...inq, status } : inq
      );
      const found = memoryInquiries.find((inq) => inq._id === id);
      return res.status(200).json({ success: true, data: found });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @route   DELETE /api/inquiries/:id
 * @desc    Delete an inquiry
 * @access  Admin
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      await Inquiry.findByIdAndDelete(id);
    } else {
      memoryInquiries = memoryInquiries.filter((inq) => inq._id !== id);
    }

    return res.status(200).json({ success: true, message: 'Inquiry deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
