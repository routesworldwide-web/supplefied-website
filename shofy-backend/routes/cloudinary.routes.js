const express = require('express');
const router = express.Router();
// internal
const uploader = require('../middleware/uploder');
const { cloudinaryController } = require('../controller/cloudinary.controller');
// NOTE: Using disk-storage uploader from middleware/uploder.js for local file uploads.
// The Cloudinary-backed implementation is preserved and commented inside the controller for later re-enable.

// add single image (disk storage)
router.post('/add-img', uploader.single('image'), cloudinaryController.saveImageCloudinary);

// add multiple images (disk storage)
router.post('/add-multiple-img', uploader.array('images', 5), cloudinaryController.addMultipleImageCloudinary);

// delete image
router.delete('/img-delete', cloudinaryController.cloudinaryDeleteController);

module.exports = router;