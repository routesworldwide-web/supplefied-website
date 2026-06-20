const express = require("express");
const router = express.Router();
const { addReview, deleteReviews, updateReview } = require("../controller/review.controller");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

// add a review
router.post("/add", verifyToken, addReview);
// delete reviews
router.delete("/delete/:id", verifyAdmin, deleteReviews);
// update review visibility
router.patch("/update/:id", verifyAdmin, updateReview);

module.exports = router;
