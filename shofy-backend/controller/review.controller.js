const mongoose = require("mongoose");
const Order = require("../model/Order");
const Products = require("../model/Products");
const Review = require("../model/Review");
const User = require("../model/User");
const {
  createAdminNotification,
} = require("../services/notification.service");

// add a review
exports.addReview = async (req, res,next) => {
  const userId = req.user?._id;
  const { productId, rating, comment } = req.body;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Please login first." });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product." });
    }

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Please select a valid rating." });
    }

    // Check if the user has already left a review for this product
    const existingReview = await Review.findOne({
      userId,
      productId,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already left a review for this product." });
    }
    const checkPurchase = await Order.findOne({
      user: new mongoose.Types.ObjectId(userId),
      "cart._id": { $in: [productId, new mongoose.Types.ObjectId(productId)] },
    });
    if (!checkPurchase) {
      return res
        .status(400)
        .json({ message: "Without purchase you can not give here review!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Create the new review
    const review = await Review.create({
      userId,
      productId,
      rating: numericRating,
      comment,
    });

    // Add the review to the product's reviews array
    const product = await Products.findById(productId);
    if (!product) {
      await review.deleteOne();
      return res.status(404).json({ message: "Product not found." });
    }
    product.reviews.push(review._id);
    await product.save();

    // Add the review to the user's reviews array
    user.reviews.push(review._id);
    await user.save();

    const commentPreview =
      review.comment && review.comment.length > 140
        ? `${review.comment.slice(0, 137)}...`
        : review.comment || "No written comment";

    await createAdminNotification({
      type: "review",
      category: "reviews",
      title: `New ${review.rating}-star review`,
      message: `${user.name} reviewed ${product.title}: ${commentPreview}`,
      link: `/reviews?review=${review._id}`,
      entityId: review._id,
      metadata: {
        productId: product._id,
        productTitle: product.title,
        reviewerName: user.name,
        rating: review.rating,
      },
    });

    return res.status(201).json({ message: "Review added successfully." });
  } catch (error) {
    next(error)
  }
};

// delete a review
exports.deleteReviews = async (req, res,next) => {
  try {
    const productId = req.params.id;
    const result = await Review.deleteMany({productId: productId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product reviews not found' });
    }
    res.json({ message: 'All reviews deleted for the product' });
  } catch (error) {
    next(error)
  }
};

// update review visibility
exports.updateReview = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["Show", "Hide"].includes(status)) {
      return res.status(400).json({ message: "Invalid review status" });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review status updated", review });
  } catch (error) {
    next(error);
  }
};
