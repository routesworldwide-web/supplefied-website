const express = require('express');
const router = express.Router();
// internal
const uploader = require('../middleware/uploder');
const { cloudinaryController } = require('../controller/cloudinary.controller');
const verifyAdmin = require('../middleware/verifyAdmin');
// add single image
router.post('/add-img', verifyAdmin, uploader.single('image'), cloudinaryController.saveImageCloudinary);

// add multiple images
router.post('/add-multiple-img', verifyAdmin, uploader.array('images', 5), cloudinaryController.addMultipleImageCloudinary);

// delete image
router.delete('/img-delete', verifyAdmin, cloudinaryController.cloudinaryDeleteController);

module.exports = router;
