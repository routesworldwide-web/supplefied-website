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

//register a staff
router.post("/register", registerAdmin);

//login a admin
router.post("/login", loginAdmin);

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
