const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Portfolio project title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Project category is required'],
      default: 'Website',
      trim: true,
    },
    year: {
      type: String,
      default: '2026',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Project image URL is required'],
      trim: true,
    },
    featured: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Map _id to id in JSON output
portfolioSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  },
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
