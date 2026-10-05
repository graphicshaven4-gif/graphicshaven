const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    excerpt: {
      type: String,
      default: '',
      trim: true,
    },
    date: {
      type: String,
      default: 'Oct 2026',
      trim: true,
    },
    readTime: {
      type: String,
      default: '5 min read',
      trim: true,
    },
    category: {
      type: String,
      default: 'Brand Strategy',
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Blog cover image is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  },
});

module.exports = mongoose.model('Blog', blogSchema);
