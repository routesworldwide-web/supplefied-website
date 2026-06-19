const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "order",
        "review",
        "staff",
        "security",
        "contact",
        "subscriber",
      ],
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["orders", "reviews", "staff", "general"],
      default: "general",
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    link: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    audienceRoles: {
      type: [String],
      default: [],
    },
    readBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Admin",
      default: [],
    },
    dismissedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Admin",
      default: [],
    },
  },
  { timestamps: true }
);

notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ category: 1, createdAt: -1 });

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

module.exports = Notification;
