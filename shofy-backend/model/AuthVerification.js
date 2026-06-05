const mongoose = require('mongoose');

const authVerificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    mobile: {
      type: String,
      required: [true, 'Please provide your mobile number'],
      trim: true,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    },
    code: {
      type: String,
      required: [true, 'Please provide the authentication code'],
      trim: true,
      uppercase: true,
    },
    isAuthenticated: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'authenticated', 'failed'],
      default: 'pending',
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    attemptCount: {
      type: Number,
      default: 1,
    },
    lastAttemptAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuthVerification', authVerificationSchema);
