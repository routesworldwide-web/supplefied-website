const express = require("express");
const multer = require("multer");
const bannerController = require("../controller/banner.controller");
const bannerUploader = require("../middleware/bannerUploader");
const verifyAdmin = require("../middleware/verifyAdmin");

const router = express.Router();
const uploadBannerImage = (req, res, next) => {
  bannerUploader.single("image")(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Banner image must be 4MB or smaller",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Invalid banner image",
    });
  });
};

router.get("/", bannerController.getActiveBanners);
router.get("/admin", verifyAdmin, bannerController.getBanners);
router.post("/", verifyAdmin, uploadBannerImage, bannerController.createBanner);
router.patch("/:id", verifyAdmin, uploadBannerImage, bannerController.updateBanner);
router.delete("/:id", verifyAdmin, bannerController.deleteBanner);

module.exports = router;
