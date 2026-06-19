const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const productListSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["wishlist", "compare"],
      required: true,
      index: true,
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    guestCartId: {
      type: String,
      required: false,
      trim: true,
      index: true,
    },
    items: [
      {
        type: ObjectId,
        ref: "Products",
        required: true,
      },
    ],
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

productListSchema.index({ type: 1, user: 1, disabled: 1 });
productListSchema.index({ type: 1, guestCartId: 1, disabled: 1 });

const ProductList = mongoose.model("ProductList", productListSchema);

module.exports = ProductList;
