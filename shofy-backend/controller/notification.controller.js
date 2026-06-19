const mongoose = require("mongoose");
const Notification = require("../model/Notification");

const getAudienceFilter = (admin) => ({
  $or: [
    { audienceRoles: { $size: 0 } },
    { audienceRoles: admin.role },
    { audienceRoles: { $exists: false } },
  ],
});

const getNotifications = async (req, res, next) => {
  try {
    const adminId = new mongoose.Types.ObjectId(req.admin._id);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);
    const audienceFilter = getAudienceFilter(req.admin);
    const visibleFilter = {
      ...audienceFilter,
      dismissedBy: { $ne: adminId },
    };

    const [notifications, unreadTotal, categoryCounts] = await Promise.all([
      Notification.find(visibleFilter).sort({ createdAt: -1 }).limit(limit).lean(),
      Notification.countDocuments({
        ...visibleFilter,
        readBy: { $ne: adminId },
      }),
      Notification.aggregate([
        {
          $match: {
            ...visibleFilter,
            readBy: { $ne: adminId },
          },
        },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]),
    ]);

    const unreadByCategory = categoryCounts.reduce(
      (counts, item) => {
        counts[item._id] = item.count;
        return counts;
      },
      { orders: 0, reviews: 0, staff: 0, general: 0 }
    );

    res.json({
      success: true,
      data: notifications.map((notification) => ({
        ...notification,
        isRead: notification.readBy.some(
          (id) => id.toString() === adminId.toString()
        ),
      })),
      unreadTotal,
      unreadByCategory,
    });
  } catch (error) {
    next(error);
  }
};

const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { readBy: req.admin._id } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      {
        ...getAudienceFilter(req.admin),
        dismissedBy: { $ne: req.admin._id },
        readBy: { $ne: req.admin._id },
      },
      { $addToSet: { readBy: req.admin._id } }
    );

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

const markCategoryRead = async (req, res, next) => {
  try {
    const allowedCategories = ["orders", "reviews", "staff", "general"];
    const { category } = req.params;

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid notification category" });
    }

    await Notification.updateMany(
      {
        ...getAudienceFilter(req.admin),
        category,
        dismissedBy: { $ne: req.admin._id },
        readBy: { $ne: req.admin._id },
      },
      { $addToSet: { readBy: req.admin._id } }
    );

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

const dismissNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: {
          dismissedBy: req.admin._id,
          readBy: req.admin._id,
        },
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  dismissNotification,
  getNotifications,
  markAllRead,
  markCategoryRead,
  markNotificationRead,
};
