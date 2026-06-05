const mongoose = require('mongoose');

const usedCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    usedBy: {
      name: String,
      email: String,
      mobile: String,
    },
    ipAddress: String,
    userAgent: String,
    usedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UsedCode', usedCodeSchema);
