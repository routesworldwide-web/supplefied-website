const fs = require("fs");
const path = require('path');

// NOTE:
// The original implementation used Cloudinary for uploads via
// `cloudinaryServices.cloudinaryImageUpload(...)`. That code is preserved
// below as a commented-out reference in case you want to re-enable Cloudinary.

/*
const { cloudinaryServices } = require("../services/cloudinary.service");

// Original Cloudinary single upload
const saveImageCloudinary_old = async (req, res,next) => {
  try {
    const result = await cloudinaryServices.cloudinaryImageUpload(req.file.buffer);
    res.status(200).json({
      success: true,
      message: "image uploaded successfully",
      data:{url:result.secure_url,id:result.public_id},
    });
  } catch (err) {
    console.log(err);
    next(err)
  }
};

// Original Cloudinary multiple upload
const addMultipleImageCloudinary_old = async (req, res) => {
  try {
    const files = req.files;
    const uploadResults = [];
    for (const file of files) {
      const result = await cloudinaryServices.cloudinaryImageUpload(file.path);
      uploadResults.push(result);
    }
    for (const file of files) {
      fs.unlinkSync(file.path);
    }
    res.status(200).json({
      success: true,
      message: "image uploaded successfully",
      data: uploadResults.length > 0 ? uploadResults.map((r)=>({url:r.secure_url,id:r.public_id})) : [],
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Failed to upload image" });
  }
};

// Original cloudinary delete
const cloudinaryDeleteController_old = async (req, res) => {
  try {
    const { folder_name, id } = req.query;
    const public_id = `${folder_name}/${id}`;
    const result = await cloudinaryServices.cloudinaryImageDelete(public_id);
    res.status(200).json({ success: true, message: "delete image successfully", data: result });
  } catch (err) {
    res.status(500).send({ success: false, message: "Failed to delete image" });
  }
};
*/

// -----------------------------------------------------------------------------
// New: Local disk-backed upload handlers (using multer diskStorage middleware)
// These return the same response shape `{ success, message, data: { url, id } }`
// so the frontend RTK queries remain compatible.
// -----------------------------------------------------------------------------

// add single image (local disk)
const saveImageCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // Construct valid URL: use http://localhost:7000 or reconstruct from request
    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:7000';
    const fileUrl = `${protocol}://${host}/images/${req.file.filename}`;
    console.log('Uploaded file URL:', fileUrl);
    res.status(200).json({
      success: true,
      message: 'image uploaded successfully',
      data: { url: fileUrl, id: req.file.filename },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// add multiple images (local disk)
const addMultipleImageCloudinary = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded', data: [] });
    }
    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:7000';
    const data = files.map((file) => ({ url: `${protocol}://${host}/images/${file.filename}`, id: file.filename }));
    res.status(200).json({ success: true, message: 'image uploaded successfully', data });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: 'Failed to upload image' });
  }
};

// delete image (by filename or id)
const cloudinaryDeleteController = async (req, res) => {
  try {
    // expected query param: id = filename
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ success: false, message: 'id is required' });
    }
    const filePath = path.join(process.cwd(), 'public', 'images', id);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.status(200).json({ success: true, message: 'delete image successfully', data: { id } });
    }
    return res.status(404).json({ success: false, message: 'file not found' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: 'Failed to delete image' });
  }
};

exports.cloudinaryController = {
  cloudinaryDeleteController,
  saveImageCloudinary,
  addMultipleImageCloudinary,
};
