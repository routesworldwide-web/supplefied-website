const mongoose = require("mongoose");

const BLOG_STATUSES = ["draft", "published"];
const BLOG_BLOCK_TYPES = ["heading", "paragraph", "quote", "list"];

const createSlug = (value = "") => {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const blogContentBlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: BLOG_BLOCK_TYPES,
      required: true,
    },
    text: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },
    level: {
      type: Number,
      min: 2,
      max: 4,
      default: 2,
    },
    items: [
      {
        type: String,
        trim: true,
        maxlength: 500,
      },
    ],
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: 260,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: 320,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      index: true,
    },
    readTime: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },
    author: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "Supplefied Team",
    },
    primaryImage: {
      type: String,
      required: true,
      trim: true,
    },
    primaryImageId: {
      type: String,
      required: true,
      trim: true,
    },
    secondaryImage: {
      type: String,
      trim: true,
    },
    secondaryImageId: {
      type: String,
      trim: true,
    },
    contentBlocks: {
      type: [blogContentBlockSchema],
      validate: {
        validator: function validateBlogContent(blocks) {
          return Boolean(this.contentHtml) || (Array.isArray(blocks) && blocks.length > 0);
        },
        message: "Blog content is required",
      },
    },
    contentHtml: {
      type: String,
      trim: true,
      maxlength: 200000,
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 40,
      },
    ],
    status: {
      type: String,
      enum: BLOG_STATUSES,
      default: "draft",
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
    },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: 180,
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 260,
    },
  },
  { timestamps: true }
);

blogSchema.pre("validate", function setBlogDefaults(next) {
  if (!this.slug && this.title) {
    this.slug = createSlug(this.title);
  } else if (this.slug) {
    this.slug = createSlug(this.slug);
  }

  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

module.exports = {
  Blog,
  BLOG_STATUSES,
  createSlug,
};
