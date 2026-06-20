const { Banner, BANNER_PLACEMENTS, isSafeRedirectLink } = require("../model/Banner");
const { cloudinaryServices } = require("../services/cloudinary.service");

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
      return res.status(400).json({ success: false, message: "Invalid banner placement" });
    }

    if (!isSafeRedirectLink(redirectLink)) {
      return res.status(400).json({
        success: false,
        message: "Redirect link must be a safe internal link",
      });
    }

    const image = await cloudinaryServices.cloudinaryImageUpload(
      req.file.buffer,
      "supplefied/banners"
    );

    const banner = await Banner.create({
      title,
      placement,
      redirectLink,
      sortOrder: Number(sortOrder || 0),
      status: status || "active",
      image: image.secure_url,
      imageId: image.public_id,
    });

    res.status(201).json({
      success: true,
      message: "Banner added successfully",
      data: banner,
    });
  } catch (error) {
    next(error);
  }
};

const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    const { title, placement, redirectLink, sortOrder, status } = req.body;

    if (placement && !BANNER_PLACEMENTS.includes(placement)) {
      return res.status(400).json({ success: false, message: "Invalid banner placement" });
    }

    if (redirectLink && !isSafeRedirectLink(redirectLink)) {
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

    if (req.file?.buffer) {
      const oldImageId = banner.imageId;
      const image = await cloudinaryServices.cloudinaryImageUpload(
        req.file.buffer,
        "supplefied/banners"
      );
      banner.image = image.secure_url;
      banner.imageId = image.public_id;
      await banner.save();
      await cloudinaryServices.cloudinaryImageDelete(oldImageId);
    } else {
      await banner.save();
    }

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      data: banner,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    await cloudinaryServices.cloudinaryImageDelete(banner.imageId);
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
