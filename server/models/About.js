const mongoose = require('mongoose');

const statItemSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      trim: true,
      default: '',
    },
    value: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const socialLinksSchema = new mongoose.Schema(
  {
    github: {
      type: String,
      trim: true,
      default: '',
    },
    linkedin: {
      type: String,
      trim: true,
      default: '',
    },
    twitter: {
      type: String,
      trim: true,
      default: '',
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const aboutSchema = new mongoose.Schema(
  {
    headline: {
      type: String,
      trim: true,
      default: '',
    },
    subheadline: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    profileImage: {
      type: String,
      trim: true,
      default: '',
    },
    resumeUrl: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    socialLinks: {
      type: socialLinksSchema,
      default: () => ({}),
    },
    stats: {
      type: [statItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

aboutSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.models.About || mongoose.model('About', aboutSchema);

