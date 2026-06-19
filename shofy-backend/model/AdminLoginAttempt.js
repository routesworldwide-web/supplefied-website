const mongoose = require("mongoose");

const adminLoginAttemptSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    ipAddress: {
      type: String,
      required: true,
      trim: true,
    },
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
    firstAttemptAt: {
      type: Date,
      default: Date.now,
    },
    lastAttemptAt: {
      type: Date,
      default: Date.now,
    },
    alertedAt: {
      type: Date,
      required: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

adminLoginAttemptSchema.index({ email: 1, ipAddress: 1 }, { unique: true });

const AdminLoginAttempt =
  mongoose.models.AdminLoginAttempt ||
  mongoose.model("AdminLoginAttempt", adminLoginAttemptSchema);

module.exports = AdminLoginAttempt;
