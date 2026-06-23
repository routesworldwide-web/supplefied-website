const mongoose = require("mongoose");

const userLoginAttemptSchema = new mongoose.Schema(
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
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

userLoginAttemptSchema.index({ email: 1, ipAddress: 1 }, { unique: true });

module.exports =
  mongoose.models.UserLoginAttempt ||
  mongoose.model("UserLoginAttempt", userLoginAttemptSchema);
