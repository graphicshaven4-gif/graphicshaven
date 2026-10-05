const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: [true, 'Testimonial author name is required'],
      trim: true,
    },
    role: {
      type: String,
      default: '',
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    avatarInitial: {
      type: String,
      default: '',
      trim: true,
      uppercase: true,
    },
    quote: {
      type: String,
      required: [true, 'Testimonial quote text is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

testimonialSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  },
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
