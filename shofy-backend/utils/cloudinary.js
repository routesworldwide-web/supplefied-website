/*
  Cloudinary config is archived here for potential future use.
  To re-enable Cloudinary, provide valid env vars in .env and
  uncomment the implementation below.

const dotenv = require("dotenv");
const cloudinaryModule = require("cloudinary");
const { secret } = require("../config/secret");

dotenv.config();
const cloudinary = cloudinaryModule.v2;

cloudinary.config({
  cloud_name: secret.cloudinary_name,
  api_key: secret.cloudinary_api_key,
  api_secret: secret.cloudinary_api_secret,
});

module.exports = cloudinary;
*/

// Export a stubbed interface while Cloudinary is disabled. The stubs throw
// descriptive errors so callers fail-fast.
const err = () => { throw new Error('Cloudinary is disabled in this build'); };
const cloudinaryStub = {
  uploader: {
    upload: err,
    upload_stream: () => { throw new Error('Cloudinary is disabled'); },
    destroy: err,
  },
};
module.exports = cloudinaryStub;