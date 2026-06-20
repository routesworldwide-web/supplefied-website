const multer = require("multer");
const path = require("path");

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BLOG_IMAGE_SIZE = 4 * 1024 * 1024;

const blogUploader = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (
      ALLOWED_EXTENSIONS.has(extension) &&
      ALLOWED_MIME_TYPES.has(file.mimetype)
    ) {
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
