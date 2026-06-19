const Notification = require("../model/Notification");

const createAdminNotification = async (data) => {
  try {
    return await Notification.create(data);
  } catch (error) {
    // Notification delivery must never break the business action that triggered it.
    console.error("Admin notification could not be created:", error.message);
    return null;
  }
};

module.exports = {
  createAdminNotification,
};
