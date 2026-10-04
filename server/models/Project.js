const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    longDescription: {
      type: String,
      trim: true,
      default: '',
    },
    techStack: {
      type: [String],
      default: [],
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    liveUrl: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    gallery: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      trim: true,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: ['published', 'draft'],
        message: '{VALUE} is not a valid project status',
      },
      default: 'published',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query performance
projectSchema.index({ featured: 1, order: 1 });
projectSchema.index({ status: 1, order: 1 });

projectSchema.pre('validate', function (next) {
  if ((!this.slug || this.slug.trim() === '') && this.title) {
    this.slug = slugify(this.title);
  }
  if (typeof next === 'function') {
    next();
  }
});

projectSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);

