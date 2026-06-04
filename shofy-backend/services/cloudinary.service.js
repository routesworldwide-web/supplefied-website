/*
  Cloudinary service functions are archived below for future re-enable.
  Current setup uses local disk storage for uploads. If you want to
  restore Cloudinary, uncomment and provide valid Cloudinary env vars.

const { secret } = require("../config/secret");
const cloudinary = require("../utils/cloudinary");
const { Readable } = require('stream');

// cloudinary Image Upload
const cloudinaryImageUpload = (imageBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { upload_preset: secret.cloudinary_upload_preset },
      (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    const bufferStream = new Readable();
    bufferStream.push(imageBuffer);
    bufferStream.push(null);

    bufferStream.pipe(uploadStream);
  });
};

// cloudinaryImageDelete
const cloudinaryImageDelete = async (public_id) => {
  const deletionResult = await cloudinary.uploader.destroy(public_id);
  return deletionResult;
};

exports.cloudinaryServices = {
  cloudinaryImageDelete,
  cloudinaryImageUpload,
};
*/

// Stubbed exports while Cloudinary is disabled. These helpers return
// rejected promises so callers fail fast and it's obvious Cloudinary is off.
const cloudinaryImageUpload = () => Promise.reject(new Error('Cloudinary disabled'));
const cloudinaryImageDelete = () => Promise.reject(new Error('Cloudinary disabled'));

exports.cloudinaryServices = {
  cloudinaryImageDelete,
  cloudinaryImageUpload,
};
