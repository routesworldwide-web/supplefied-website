const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const cartSchema = mongoose.Schema(
  {
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
        product: {
          type: ObjectId,
          ref: "Products",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
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

cartSchema.index({ user: 1, disabled: 1 });
cartSchema.index({ guestCartId: 1, disabled: 1 });

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
