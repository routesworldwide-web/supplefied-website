const { cloudinaryServices } = require("../services/cloudinary.service");

const toUploadResponse = (result) => ({
  url: result.secure_url,
  id: result.public_id,
});

const saveImageCloudinary = async (req, res, next) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await cloudinaryServices.cloudinaryImageUpload(
      req.file.buffer,
      "supplefied/products"
    );

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: toUploadResponse(result),
    });
  } catch (error) {
    next(error);
  }
};

const addMultipleImageCloudinary = async (req, res, next) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
        data: [],
      });
    }

    const results = await Promise.all(
      req.files.map((file) =>
        cloudinaryServices.cloudinaryImageUpload(
          file.buffer,
          "supplefied/products"
        )
      )
    );

    return res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      data: results.map(toUploadResponse),
    });
  } catch (error) {
    next(error);
  }
};

const cloudinaryDeleteController = async (req, res, next) => {
  try {
    const publicId = String(req.query.id || "").trim();

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "id is required",
      });
    }

    const result = await cloudinaryServices.cloudinaryImageDelete(publicId);

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.cloudinaryController = {
  cloudinaryDeleteController,
  saveImageCloudinary,
  addMultipleImageCloudinary,
};
