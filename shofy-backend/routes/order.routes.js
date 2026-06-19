const express = require("express");
const {
  createRazorpayOrder,
  addOrder,
  getOrders,
  updateOrderStatus,
  getSingleOrder,
} = require("../controller/order.controller");
const verifyAdmin = require("../middleware/verifyAdmin");

// router
const router = express.Router();

// get orders
router.get("/orders", getOrders);
// single order
router.get("/:id", getSingleOrder);
// create Razorpay payment order
router.post("/create-razorpay-order", createRazorpayOrder);
// save Order
router.post("/saveOrder", addOrder);
// update status
router.patch("/update-status/:id", verifyAdmin, updateOrderStatus);

module.exports = router;
