const multer = require("multer");
const path = require("path");

const uploader = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const supportedExtensions = /\.(png|jpg|jpeg|webp)$/i;
    const supportedMimeTypes = ["image/png", "image/jpeg", "image/webp"];
    const extension = path.extname(file.originalname);

    if (
      supportedExtensions.test(extension) &&
      supportedMimeTypes.includes(file.mimetype)
    ) {
      cb(null, true);
      return;
    }

    cb(new Error("Must be a png/jpg/jpeg/webp image"));
  },
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
});

module.exports = uploader;
