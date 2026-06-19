const express = require("express");
const router = express.Router();
const { addReview, deleteReviews, updateReview } = require("../controller/review.controller");
const verifyToken = require("../middleware/verifyToken");

// add a review
router.post("/add", verifyToken, addReview);
// delete reviews
router.delete("/delete/:id", deleteReviews);
// update review visibility
router.patch("/update/:id", updateReview);

module.exports = router;
