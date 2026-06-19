const crypto = require("crypto");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const BANNER_DIR = path.join(process.cwd(), "public", "images", "banners");
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BANNER_SIZE = 4 * 1024 * 1024;

const ensureBannerDir = () => {
  if (!fs.existsSync(BANNER_DIR)) {
    fs.mkdirSync(BANNER_DIR, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureBannerDir();
    cb(null, BANNER_DIR);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `banner-${Date.now()}-${crypto.randomUUID()}${extension}`);
  },
});

const bannerUploader = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (ALLOWED_EXTENSIONS.has(extension) && ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
      return;
    }

    cb(new Error("Banner image must be a JPG, PNG, or WEBP file"));
  },
  limits: {
    fileSize: MAX_BANNER_SIZE,
  },
});

module.exports = bannerUploader;
