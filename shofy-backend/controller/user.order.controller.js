const mongoose = require("mongoose");
const Order = require("../model/Order");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const isToday = require("dayjs/plugin/isToday");
const isYesterday = require("dayjs/plugin/isYesterday");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
const {
  createAdminNotification,
} = require("../services/notification.service");

const CANCELLATION_REASONS = {
  ordered_by_mistake: "Ordered by mistake",
  change_order: "Need to change the order",
  delivery_too_long: "Delivery will take too long",
  payment_issue: "Payment issue",
  found_another_option: "Found another option",
  other: "Other",
};

// Apply necessary plugins to dayjs
dayjs.extend(customParseFormat);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// get all orders user
module.exports.getOrderByUser = async (req, res,next) => {
  try {
    const { page, limit } = req.query;

    const pages = Number(page) || 1;
    const limits = Number(limit) || 8;
    const skip = (pages - 1) * limits;

    const totalDoc = await Order.countDocuments({ user: req.user._id });

    // total padding order count
    const totalPendingOrder = await Order.aggregate([
      {
        $match: {
          status: "pending",
          user: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // total padding order count
    const totalProcessingOrder = await Order.aggregate([
      {
        $match: {
          status: "processing",
          user: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const totalDeliveredOrder = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          user: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // today order amount

    // query for orders
    const orders = await Order.find({ user: req.user._id }).sort({ _id: -1 });

    res.send({
      orders,
      pending: totalPendingOrder.length === 0 ? 0 : totalPendingOrder[0].count,
      processing:
        totalProcessingOrder.length === 0 ? 0 : totalProcessingOrder[0].count,
      delivered:
        totalDeliveredOrder.length === 0 ? 0 : totalDeliveredOrder[0].count,

      totalDoc,
    });
  } catch (error) {
    next(error)
  }
};

// getOrderById
module.exports.getOrderById = async (req, res,next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error)
  }
};

// Customers can cancel only their own pending orders.
module.exports.cancelOrderByUser = async (req, res, next) => {
  try {
    const { reasonCode, reason } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    if (!Object.prototype.hasOwnProperty.call(CANCELLATION_REASONS, reasonCode)) {
      return res.status(400).json({
        message: "Please select a valid cancellation reason",
      });
    }

    const normalizedReason = String(reason || "").trim();
    if (reasonCode === "other" && normalizedReason.length < 5) {
      return res.status(400).json({
        message: "Please briefly explain why you are cancelling the order",
      });
    }
    if (normalizedReason.length > 500) {
      return res.status(400).json({
        message: "Cancellation reason cannot exceed 500 characters",
      });
    }

    const cancellationReason =
      reasonCode === "other"
        ? normalizedReason
        : normalizedReason || CANCELLATION_REASONS[reasonCode];
    const cancelledAt = new Date();
    const ownedOrder = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).select("status paymentMethod");

    if (!ownedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (ownedOrder.status !== "pending") {
      return res.status(409).json({
        message:
          ownedOrder.status === "cancel"
            ? "This order has already been cancelled"
            : "Only pending orders can be cancelled",
      });
    }

    const refundStatus =
      ownedOrder.paymentMethod === "Razorpay" ? "pending" : "not_required";

    const order = await Order.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
        status: "pending",
      },
      {
        $set: {
          status: "cancel",
          cancellation: {
            reasonCode,
            reason: cancellationReason,
            cancelledBy: "customer",
            cancelledAt,
            previousStatus: "pending",
            refundStatus,
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(409).json({
        message:
          "The order status changed before cancellation completed. Please refresh and try again.",
      });
    }

    await createAdminNotification({
      type: "order",
      category: "orders",
      title: `Order #${order.invoice} cancelled by customer`,
      message: `${order.name} cancelled the order. Reason: ${cancellationReason}`,
      link: `/orders/${order._id}`,
      entityId: order._id,
      metadata: {
        invoice: order.invoice,
        customerName: order.name,
        cancellationReason,
        paymentMethod: order.paymentMethod,
        refundStatus,
      },
    });

    res.status(200).json({
      success: true,
      message: "Your order has been cancelled",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// getDashboardAmount
exports.getDashboardAmount = async (req, res,next) => {
  try {
    const todayStart = dayjs().startOf("day");
    const todayEnd = dayjs().endOf("day");

    const yesterdayStart = dayjs().subtract(1, "day").startOf("day");
    const yesterdayEnd = dayjs().subtract(1, "day").endOf("day");

    const monthStart = dayjs().startOf("month");
    const monthEnd = dayjs().endOf("month");

    const validOrderFilter = { status: { $ne: "cancel" } };
    const todayOrders = await Order.find({
      ...validOrderFilter,
      createdAt: { $gte: todayStart.toDate(), $lte: todayEnd.toDate() },
    });

    let todayCashPaymentAmount = 0;
    let todayCardPaymentAmount = 0;

    todayOrders.forEach((order) => {
      if (order.paymentMethod === "COD") {
        todayCashPaymentAmount += order.totalAmount;
      } else if (order.paymentMethod === "Razorpay") {
        todayCardPaymentAmount += order.totalAmount;
      }
    });

    const yesterdayOrders = await Order.find({
      ...validOrderFilter,
      createdAt: { $gte: yesterdayStart.toDate(), $lte: yesterdayEnd.toDate() },
    });

    let yesterDayCashPaymentAmount = 0;
    let yesterDayCardPaymentAmount = 0;

    yesterdayOrders.forEach((order) => {
      if (order.paymentMethod === "COD") {
        yesterDayCashPaymentAmount += order.totalAmount;
      } else if (order.paymentMethod === "Razorpay") {
        yesterDayCardPaymentAmount += order.totalAmount;
      }
    });

    const monthlyOrders = await Order.find({
      ...validOrderFilter,
      createdAt: { $gte: monthStart.toDate(), $lte: monthEnd.toDate() },
    });

    const totalOrders = await Order.find(validOrderFilter);
    const todayOrderAmount = todayOrders.reduce(
      (total, order) => total + order.totalAmount,
      0
    );
    const yesterdayOrderAmount = yesterdayOrders.reduce(
      (total, order) => total + order.totalAmount,
      0
    );

    const monthlyOrderAmount = monthlyOrders.reduce((total, order) => {
      return total + order.totalAmount;
    }, 0);
    const totalOrderAmount = totalOrders.reduce(
      (total, order) => total + order.totalAmount,
      0
    );

    res.status(200).send({
      todayOrderAmount,
      yesterdayOrderAmount,
      monthlyOrderAmount,
      totalOrderAmount,
      todayCardPaymentAmount,
      todayCashPaymentAmount,
      yesterDayCardPaymentAmount,
      yesterDayCashPaymentAmount,
      todayOrderCount: todayOrders.length,
      yesterdayOrderCount: yesterdayOrders.length,
      monthlyOrderCount: monthlyOrders.length,
      totalOrderCount: totalOrders.length,
    });
  } catch (error) {
    next(error)
  }
};
// get sales report
exports.getSalesReport = async (req, res,next) => {
  try {
    const startOfWeek = dayjs().subtract(6, "day").startOf("day");
    const endOfToday = dayjs().endOf("day");

    const salesOrderChartData = await Order.find({
      status: { $ne: "cancel" },
      createdAt: {
        $gte: startOfWeek.toDate(),
        $lte: endOfToday.toDate(),
      },
    }).select("createdAt totalAmount");

    const salesByDate = salesOrderChartData.reduce((result, order) => {
      const date = dayjs(order.createdAt).format("YYYY-MM-DD");

      if (!result[date]) {
        result[date] = { total: 0, order: 0 };
      }
      result[date].total += Number(order.totalAmount || 0);
      result[date].order += 1;
      return result;
    }, {});

    const salesReportData = Array.from({ length: 7 }, (_, index) => {
      const date = startOfWeek.add(index, "day").format("YYYY-MM-DD");
      return {
        date,
        total: Number((salesByDate[date]?.total || 0).toFixed(2)),
        order: salesByDate[date]?.order || 0,
      };
    });

    res.status(200).json({ salesReport: salesReportData });
  } catch (error) {
    // Handle error if any
    next(error)
  }
};

// Most Selling Category
exports.mostSellingCategory = async (req, res,next) => {
  try {
    const categoryData = await Order.aggregate([
      {
        $match: {
          status: { $ne: "cancel" },
        },
      },
      {
        $unwind: "$cart",
      },
      {
        $set: {
          currentProductId: {
            $convert: {
              input: { $ifNull: ["$cart.productId", "$cart._id"] },
              to: "objectId",
              onError: null,
              onNull: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "currentProductId",
          foreignField: "_id",
          as: "currentProduct",
        },
      },
      {
        $unwind: {
          path: "$currentProduct",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          currentCategoryId: {
            $convert: {
              input: {
                $ifNull: [
                  "$currentProduct.category.id",
                  "$cart.category.id",
                ],
              },
              to: "objectId",
              onError: null,
              onNull: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "currentCategoryId",
          foreignField: "_id",
          as: "currentCategory",
        },
      },
      {
        $unwind: {
          path: "$currentCategory",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          categoryName: {
            $ifNull: [
              "$currentCategory.parent",
              {
                $ifNull: [
                  "$currentProduct.category.name",
                  {
                    $ifNull: [
                      "$cart.category.name",
                      {
                        $ifNull: [
                          "$cart.parent",
                          { $ifNull: ["$cart.children", "Uncategorized"] },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          itemQuantity: {
            $convert: {
              input: { $ifNull: ["$cart.orderQuantity", 1] },
              to: "double",
              onError: 1,
              onNull: 1,
            },
          },
          itemUnitPrice: {
            $convert: {
              input: {
                $ifNull: [
                  "$cart.finalPrice",
                  {
                    $multiply: [
                      { $ifNull: ["$cart.price", 0] },
                      {
                        $subtract: [
                          1,
                          {
                            $divide: [
                              { $ifNull: ["$cart.discount", 0] },
                              100,
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              to: "double",
              onError: 0,
              onNull: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: "$categoryName",
          unitsSold: { $sum: "$itemQuantity" },
          revenue: {
            $sum: { $multiply: ["$itemUnitPrice", "$itemQuantity"] },
          },
        },
      },
      {
        $sort: { revenue: -1, unitsSold: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          unitsSold: { $round: ["$unitsSold", 0] },
          revenue: { $round: ["$revenue", 2] },
        },
      },
    ]);

    res.status(200).json({ categoryData });
  } catch (error) {
    next(error)
  }
};

// dashboard recent order
exports.getDashboardRecentOrder = async (req, res,next) => {
  try {
    const { page, limit } = req.query;

    const pages = Number(page) || 1;
    const limits = Number(limit) || 8;
    const skip = (pages - 1) * limits;

    const queryObject = {
      status: { $in: ["pending", "processing", "delivered", "cancel"] },
    };

    const totalDoc = await Order.countDocuments(queryObject);

    const orders = await Order.aggregate([
      { $match: queryObject },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          invoice: 1,
          createdAt: 1,
          updatedAt: 1,
          paymentMethod: 1,
          name: 1,
          user: 1,
          totalAmount: 1,
          status:1,
        },
      },
    ]);

    res.status(200).send({
      orders: orders,
      page: page,
      limit: limit,
      totalOrder: totalDoc,
    });
  } catch (error) {
    next(error)
  }
};
