const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E4);
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueSuffix + extension);
  }
});

const uploader = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const supportedExtensions = /\.(png|jpg|jpeg|webp)$/i;
    const supportedMimeTypes = ["image/png", "image/jpeg", "image/webp"];
    const extension = path.extname(file.originalname);

    if (supportedExtensions.test(extension) && supportedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Must be a png/jpg/jpeg/webp image"));
    }
  },
  limits: {
    fileSize: 3 * 1024 * 1024,
  }
});

module.exports = uploader;
