const express = require('express');
const router = express.Router();
const {
  addCoupon,
  addAllCoupon,
  getAllCoupons,
  validateCoupon,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} = require('../controller/coupon.controller');
const verifyAdmin = require('../middleware/verifyAdmin');

//add a coupon
router.post('/add', verifyAdmin, addCoupon);

//add multiple coupon
router.post('/all', verifyAdmin, addAllCoupon);

// Public storefront coupons are limited to active records.
router.get('/', (req, res, next) => {
  req.query.status = "active";
  return getAllCoupons(req, res, next);
});

// Admin coupon list includes every status.
router.get('/admin', verifyAdmin, getAllCoupons);

//validate a coupon before applying it
router.post('/validate', validateCoupon);

//get a coupon
router.get('/:id', verifyAdmin, getCouponById);

//update a coupon
router.patch('/:id', verifyAdmin, updateCoupon);

//delete a coupon
router.delete('/:id', verifyAdmin, deleteCoupon);

module.exports = router;
