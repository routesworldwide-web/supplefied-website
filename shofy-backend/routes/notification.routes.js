const express = require("express");
const verifyAdmin = require("../middleware/verifyAdmin");
const {
  dismissNotification,
  getNotifications,
  markAllRead,
  markCategoryRead,
  markNotificationRead,
} = require("../controller/notification.controller");

const router = express.Router();

router.use(verifyAdmin);
router.get("/", getNotifications);
router.patch("/read-all", markAllRead);
router.patch("/read-category/:category", markCategoryRead);
router.patch("/:id/read", markNotificationRead);
router.patch("/:id/dismiss", dismissNotification);

module.exports = router;
