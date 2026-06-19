const fs = require("fs");
const path = require("path");
const { Banner, BANNER_PLACEMENTS, isSafeRedirectLink } = require("../model/Banner");

const getBannerUrl = (req, filename) => {
  const protocol = req.protocol || "http";
  const host = req.get("host") || "localhost:7000";
  return `${protocol}://${host}/images/banners/${filename}`;
};

const removeLocalBannerImage = (imageId) => {
  if (!imageId) return;

  const imagePath = path.join(process.cwd(), "public", "images", "banners", imageId);

  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
};

const getBanners = async (req, res, next) => {
  try {
    const query = {};

    if (req.query.placement) {
      query.placement = req.query.placement;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    const banners = await Banner.find(query).sort({ placement: 1, sortOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: banners,
    });
  } catch (error) {
    next(error);
  }
};

const getActiveBanners = async (req, res, next) => {
  try {
    const query = { status: "active" };

    if (req.query.placement) {
      query.placement = req.query.placement;
    }

    const banners = await Banner.find(query).sort({ sortOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: banners,
    });
  } catch (error) {
    next(error);
  }
};

const createBanner = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Banner image is required" });
    }

    const { title, placement, redirectLink, sortOrder, status } = req.body;

    if (!BANNER_PLACEMENTS.includes(placement)) {
      removeLocalBannerImage(req.file.filename);
      return res.status(400).json({ success: false, message: "Invalid banner placement" });
    }

    if (!isSafeRedirectLink(redirectLink)) {
      removeLocalBannerImage(req.file.filename);
      return res.status(400).json({
        success: false,
        message: "Redirect link must be a safe internal link",
      });
    }

    const banner = await Banner.create({
      title,
      placement,
      redirectLink,
      sortOrder: Number(sortOrder || 0),
      status: status || "active",
      image: getBannerUrl(req, req.file.filename),
      imageId: req.file.filename,
    });

    res.status(201).json({
      success: true,
      message: "Banner added successfully",
      data: banner,
    });
  } catch (error) {
    if (req.file?.filename) {
      removeLocalBannerImage(req.file.filename);
    }
    next(error);
  }
};

const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      if (req.file?.filename) {
        removeLocalBannerImage(req.file.filename);
      }
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    const { title, placement, redirectLink, sortOrder, status } = req.body;

    if (placement && !BANNER_PLACEMENTS.includes(placement)) {
      if (req.file?.filename) {
        removeLocalBannerImage(req.file.filename);
      }
      return res.status(400).json({ success: false, message: "Invalid banner placement" });
    }

    if (redirectLink && !isSafeRedirectLink(redirectLink)) {
      if (req.file?.filename) {
        removeLocalBannerImage(req.file.filename);
      }
      return res.status(400).json({
        success: false,
        message: "Redirect link must be a safe internal link",
      });
    }

    if (typeof title !== "undefined") banner.title = title;
    if (placement) banner.placement = placement;
    if (redirectLink) banner.redirectLink = redirectLink;
    if (typeof sortOrder !== "undefined") banner.sortOrder = Number(sortOrder || 0);
    if (status) banner.status = status;

    if (req.file?.filename) {
      removeLocalBannerImage(banner.imageId);
      banner.image = getBannerUrl(req, req.file.filename);
      banner.imageId = req.file.filename;
    }

    await banner.save();

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      data: banner,
    });
  } catch (error) {
    if (req.file?.filename) {
      removeLocalBannerImage(req.file.filename);
    }
    next(error);
  }
};

const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    removeLocalBannerImage(banner.imageId);
    await banner.deleteOne();

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBanner,
  deleteBanner,
  getActiveBanners,
  getBanners,
  updateBanner,
};
