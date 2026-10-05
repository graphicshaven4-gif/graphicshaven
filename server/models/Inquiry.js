const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide client name'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      required: [true, 'Please provide client email'],
      trim: true,
      lowercase: true,
    },
    service: {
      type: String,
      default: 'General Inquiry',
    },
    budget: {
      type: String,
      default: 'Not specified',
    },
    details: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['New', 'In Review', 'Contacted'],
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
