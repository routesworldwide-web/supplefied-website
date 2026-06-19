const Coupon = require('../model/Coupon');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

// addCoupon
const addCoupon = async (req, res,next) => {
  try {
    const newCoupon = new Coupon(req.body);
    if(!newCoupon.startTime){
      newCoupon.startTime = new Date()
    }
    await newCoupon.save();
    res.send({ message: 'Coupon Added Successfully!' });
  } catch (error) {
    next(error)
  }
};
// addAllCoupon
const addAllCoupon = async (req, res,next) => {
  try {
    await Coupon.deleteMany();
    await Coupon.insertMany(req.body);
    res.status(200).send({
      message: 'Coupon Added successfully!',
    });
  } catch (error) {
    next(error)
  }
};
// getAllCoupons
const getAllCoupons = async (req, res,next) => {
  try {
    const filter =
      req.query.status === "active"
        ? { status: { $ne: "inactive" } }
        : req.query.status === "inactive"
        ? { status: "inactive" }
        : {};
    const coupons = await Coupon.find(filter).sort({ _id: -1 });
    res.send(coupons);
  } catch (error) {
    next(error)
  }
};
// validateCoupon
const validateCoupon = async (req, res, next) => {
  try {
    const couponCode = String(req.body.couponCode || "").trim();

    if (!couponCode) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

    const coupon = await Coupon.findOne({
      couponCode,
      status: { $ne: "inactive" },
    });

    if (
      !coupon ||
      (coupon.startTime && dayjs().isBefore(dayjs(coupon.startTime))) ||
      dayjs().isAfter(dayjs(coupon.endTime))
    ) {
      return res.status(404).json({
        message: "This coupon is inactive, expired, or invalid",
      });
    }

    res.send(coupon);
  } catch (error) {
    next(error);
  }
};
// getCouponById
const getCouponById = async (req, res,next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    res.send(coupon);
  } catch (error) {
    next(error)
  }
};
// updateCoupon
const updateCoupon = async (req, res,next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    const editableFields = [
      "title",
      "couponCode",
      "discountPercentage",
      "minimumAmount",
      "productType",
      "logo",
      "status",
    ];

    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        coupon[field] = req.body[field];
      }
    });

    if (req.body.startTime !== undefined) {
      coupon.startTime = dayjs(req.body.startTime).utc().toDate();
    }
    if (req.body.endTime !== undefined) {
      coupon.endTime = dayjs(req.body.endTime).utc().toDate();
    }

    await coupon.save();
    res.send({ message: 'Coupon Updated Successfully!' });
  } catch (error) {
    // console.log('coupon error',error)
    next(error)
  }
};
// deleteCoupon
const deleteCoupon = async (req, res,next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success:true,
      message:'Coupon delete successfully',
    })
  } catch (error) {
    next(error)
  }
};

module.exports = {
  addCoupon,
  addAllCoupon,
  getAllCoupons,
  validateCoupon,
  getCouponById,
  updateCoupon,
  deleteCoupon,
};
