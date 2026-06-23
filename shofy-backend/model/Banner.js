const mongoose = require("mongoose");

const BANNER_PLACEMENTS = [
  "home-hero-slider",
  "home-banner-section-1",
  "home-banner-section-2",
  "product-gadget-banner",
  "product-gadget-sidebar",
  "product-banner-slider",
  "blog-page-banner",
];

const isSafeRedirectLink = (value = "") => {
  return (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.toLowerCase().startsWith("/\\") &&
    !value.toLowerCase().includes("javascript:")
  );
};

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    imageId: {
      type: String,
      required: true,
      trim: true,
    },
    redirectLink: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isSafeRedirectLink,
        message: "Redirect link must be a safe internal link",
      },
    },
    placement: {
      type: String,
      required: true,
      enum: BANNER_PLACEMENTS,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);

module.exports = {
  Banner,
  BANNER_PLACEMENTS,
  isSafeRedirectLink,
};
