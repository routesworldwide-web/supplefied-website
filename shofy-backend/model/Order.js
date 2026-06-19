const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cart: [{}],
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    coupon: {
      title: {
        type: String,
        required: false,
      },
      couponCode: {
        type: String,
        required: false,
      },
      discountPercentage: {
        type: Number,
        required: false,
      },
      productType: {
        type: String,
        required: false,
      },
      discountAmount: {
        type: Number,
        required: false,
      },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingOption: {
      type: String,
      required: false,
    },
    cardInfo: {
      type: Object,
      required: false,
    },
    paymentIntent: {
      type: Object,
      required: false,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    orderNote: {
      type: String,
      required: false,
    },
    invoice: {
      type: Number,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "delivered",'cancel'],
      lowercase: true,
    },
    cancellation: {
      reasonCode: {
        type: String,
        enum: [
          "ordered_by_mistake",
          "change_order",
          "delivery_too_long",
          "payment_issue",
          "found_another_option",
          "other",
          "admin_cancelled",
        ],
        required: false,
      },
      reason: {
        type: String,
        trim: true,
        maxlength: 500,
        required: false,
      },
      cancelledBy: {
        type: String,
        enum: ["customer", "admin"],
        required: false,
      },
      cancelledAt: {
        type: Date,
        required: false,
      },
      previousStatus: {
        type: String,
        enum: ["pending", "processing"],
        required: false,
      },
      refundStatus: {
        type: String,
        enum: ["not_required", "pending", "processed", "failed"],
        required: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// define pre-save middleware to generate the invoice number
orderSchema.pre('save', async function (next) {
  const order = this;
  if (!order.invoice) { // check if the order already has an invoice number
    try {
      // find the highest invoice number in the orders collection
      const highestInvoice = await mongoose
        .model('Order')
        .find({})
        .sort({ invoice: 'desc' })
        .limit(1)
        .select({ invoice: 1 });
      // if there are no orders in the collection, start at 1000
      const startingInvoice = highestInvoice.length === 0 ? 1000 : highestInvoice[0].invoice + 1;
      // set the invoice number for the new order
      order.invoice = startingInvoice;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
module.exports = Order;
