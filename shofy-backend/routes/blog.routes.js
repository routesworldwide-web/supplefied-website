const express = require("express");
const multer = require("multer");
const blogController = require("../controller/blog.controller");
const blogUploader = require("../middleware/blogUploader");
const verifyAdmin = require("../middleware/verifyAdmin");

const router = express.Router();

const uploadBlogImages = (req, res, next) => {
  blogUploader.fields([
    { name: "primaryImage", maxCount: 1 },
    { name: "secondaryImage", maxCount: 1 },
  ])(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Blog image must be 4MB or smaller",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Invalid blog image",
    });
  });
};

router.get("/", blogController.getPublicBlogs);
router.get("/admin", verifyAdmin, blogController.getAdminBlogs);
router.get("/:slug", blogController.getPublicBlogBySlug);
router.post("/", verifyAdmin, uploadBlogImages, blogController.createBlog);
router.patch("/:id", verifyAdmin, uploadBlogImages, blogController.updateBlog);
router.delete("/:id", verifyAdmin, blogController.deleteBlog);

module.exports = router;
