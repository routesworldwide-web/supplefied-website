const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  updateStaff,
  changePassword,
  addStaff,
  getAllStaff,
  deleteStaff,
  getStaffById,
  forgetPassword,
  confirmAdminEmail,
  confirmAdminForgetPass,
  updatedStatus,
} = require("../controller/admin.controller");
const verifyAdmin = require("../middleware/verifyAdmin");
const AdminLoginAttempt = require("../model/AdminLoginAttempt");
const {
  requireTurnstileAfterFailures,
} = require("../middleware/verifyTurnstile");

const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_CAPTCHA_THRESHOLD = 3;

//register a staff
router.post("/register", registerAdmin);

//login a admin
router.post(
  "/login",
  requireTurnstileAfterFailures({
    AttemptModel: AdminLoginAttempt,
    threshold: LOGIN_CAPTCHA_THRESHOLD,
    windowMs: LOGIN_ATTEMPT_WINDOW_MS,
    expectedAction: "admin-login",
  }),
  loginAdmin
);

//login a admin
router.patch("/change-password", verifyAdmin, changePassword);

//login a admin
router.post("/add", verifyAdmin, addStaff);

//login a admin
router.get("/all", verifyAdmin, getAllStaff);

//forget-password
router.patch("/forget-password", forgetPassword);

//forget-password
router.patch("/confirm-forget-password", confirmAdminForgetPass);

//get a staff
router.get("/get/:id", verifyAdmin, getStaffById);

// update a staff
router.patch("/update-stuff/:id", verifyAdmin, updateStaff);

//update staf status
router.patch("/update-status/:id", verifyAdmin, updatedStatus);

//delete a staff
router.delete("/:id", verifyAdmin, deleteStaff);

module.exports = router;
