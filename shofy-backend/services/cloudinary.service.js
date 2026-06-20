const { Readable } = require("stream");
const cloudinary = require("../utils/cloudinary");

const cloudinaryImageUpload = (imageBuffer, folder = "supplefied") =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        use_filename: false,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    Readable.from(imageBuffer).pipe(uploadStream);
  });

const cloudinaryImageDelete = async (publicId) => {
  if (!publicId) return null;
  return cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
};

exports.cloudinaryServices = {
  cloudinaryImageDelete,
  cloudinaryImageUpload,
};
