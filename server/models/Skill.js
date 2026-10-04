const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: '',
    },
    icon: {
      type: String,
      trim: true,
      default: '',
    },
    level: {
      type: Number,
      min: [0, 'Skill level cannot be below 0'],
      max: [100, 'Skill level cannot exceed 100'],
      default: 0,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for categorized order sorting
skillSchema.index({ category: 1, order: 1 });

skillSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.models.Skill || mongoose.model('Skill', skillSchema);

