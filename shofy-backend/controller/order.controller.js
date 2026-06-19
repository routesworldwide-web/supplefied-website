const { secret } = require("../config/secret");
const crypto = require("crypto");
const https = require("https");
const Order = require("../model/Order");
const { sendOrderConfirmationEmail } = require("../services/order-email.service");
const {
  createAdminNotification,
} = require("../services/notification.service");

const createRazorpayOrder = ({ amount, currency = "INR", receipt }) => {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(
      `${secret.razorpay_key_id}:${secret.razorpay_key_secret}`
    ).toString("base64");
    const payload = JSON.stringify({
      amount,
      currency,
      receipt,
    });

    const request = https.request(
      {
        hostname: "api.razorpay.com",
        path: "/v1/orders",
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          let parsed = {};

          try {
            parsed = data ? JSON.parse(data) : {};
          } catch {
            parsed = {};
          }

          if (response.statusCode >= 200 && response.statusCode < 300) {
            resolve(parsed);
            return;
          }

          reject(new Error(parsed?.error?.description || "Razorpay order failed"));
        });
      }
    );

    request.on("error", reject);
    request.write(payload);
    request.end();
  });
};

// create-razorpay-order
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const amount = Math.round(Number(req.body.amount) * 100);

    if (!secret.razorpay_key_id || !secret.razorpay_key_secret) {
      return res.status(500).json({
        success: false,
        message: "Razorpay credentials are not configured",
      });
    }

    if (!amount || amount < 100) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    const razorpayOrder = await createRazorpayOrder({
      amount,
      receipt: `receipt_${Date.now()}`,
    });

    res.status(200).json({
      success: true,
      key: secret.razorpay_key_id,
      order: razorpayOrder,
    });
  } catch (error) {
    console.log(error);
    next(error)
  }
};

exports.verifyRazorpayPayment = (payment = {}) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = payment;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return false;
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret.razorpay_key_secret)
    .update(body)
    .digest("hex");

  return expectedSignature === razorpay_signature;
};

// addOrder
exports.addOrder = async (req, res, next) => {
  try {
    if (req.body.paymentMethod === "Razorpay") {
      const isValidPayment = exports.verifyRazorpayPayment(req.body.paymentIntent);

      if (!isValidPayment) {
        return res.status(400).json({
          success: false,
          message: "Razorpay payment verification failed",
        });
      }
    }

    const orderItems = await Order.create(req.body);
    await createAdminNotification({
      type: "order",
      category: "orders",
      title: `New order #${orderItems.invoice}`,
      message: `${orderItems.name} placed an order for ₹${Number(
        orderItems.totalAmount
      ).toFixed(2)}.`,
      link: `/orders/${orderItems._id}`,
      entityId: orderItems._id,
      metadata: {
        invoice: orderItems.invoice,
        customerName: orderItems.name,
        totalAmount: orderItems.totalAmount,
        paymentMethod: orderItems.paymentMethod,
      },
    });

    try {
      await sendOrderConfirmationEmail(orderItems);
    } catch (emailError) {
      // Email delivery should not block a successfully saved order.
      console.log("Order confirmation email failed:", emailError.message);
    }

    res.status(200).json({
      success: true,
      message: "Order added successfully",
      order: orderItems,
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};
// get Orders
exports.getOrders = async (req, res, next) => {
  try {
    const orderItems = await Order.find({}).populate('user');
    res.status(200).json({
      success: true,
      data: orderItems,
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};
// get Orders
exports.getSingleOrder = async (req, res, next) => {
  try {
    const orderItem = await Order.findById(req.params.id).populate('user');
    res.status(200).json(orderItem);
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  const newStatus = req.body.status;
  try {
    const allowedStatuses = ["pending", "processing", "delivered", "cancel"];
    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (["cancel", "delivered"].includes(order.status) && newStatus !== order.status) {
      return res.status(409).json({
        message: `${order.status === "cancel" ? "Cancelled" : "Delivered"} orders cannot be reopened`,
      });
    }

    if (newStatus === "pending" && order.status !== "pending") {
      return res.status(409).json({
        message: "Orders cannot be moved back to pending",
      });
    }

    const previousStatus = order.status;
    order.status = newStatus;

    if (newStatus === "cancel" && previousStatus !== "cancel") {
      order.cancellation = {
        reasonCode: "admin_cancelled",
        reason: String(req.body.reason || "Cancelled by administrator").trim(),
        cancelledBy: "admin",
        cancelledAt: new Date(),
        previousStatus,
        refundStatus:
          order.paymentMethod === "Razorpay" ? "pending" : "not_required",
      };
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      order,
    });
  }
  catch (error) {
    next(error);
  }
};
