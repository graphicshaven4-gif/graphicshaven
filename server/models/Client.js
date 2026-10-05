const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Client brand name is required'],
      trim: true,
    },
    initials: {
      type: String,
      default: '',
      trim: true,
      uppercase: true,
    },
    category: {
      type: String,
      default: 'Technology',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

clientSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  },
});

module.exports = mongoose.model('Client', clientSchema);
