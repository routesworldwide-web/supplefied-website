const crypto = require("crypto");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const BLOG_IMAGE_DIR = path.join(process.cwd(), "public", "images", "blogs");
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BLOG_IMAGE_SIZE = 4 * 1024 * 1024;

const ensureBlogImageDir = () => {
  if (!fs.existsSync(BLOG_IMAGE_DIR)) {
    fs.mkdirSync(BLOG_IMAGE_DIR, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureBlogImageDir();
    cb(null, BLOG_IMAGE_DIR);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `blog-${Date.now()}-${crypto.randomUUID()}${extension}`);
  },
});

const blogUploader = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (ALLOWED_EXTENSIONS.has(extension) && ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
      return;
    }

    cb(new Error("Blog image must be a JPG, PNG, or WEBP file"));
  },
  limits: {
    fileSize: MAX_BLOG_IMAGE_SIZE,
  },
});

module.exports = blogUploader;
