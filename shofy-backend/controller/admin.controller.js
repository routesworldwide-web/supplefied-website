const bcrypt = require("bcryptjs");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
const jwt = require('jsonwebtoken');
const { tokenForVerify } = require("../config/auth");
const Admin = require("../model/Admin");
const AdminLoginAttempt = require("../model/AdminLoginAttempt");
const { generateToken } = require("../utils/token");
const { sendEmail } = require("../config/email");
const { secret } = require("../config/secret");
const {
  createAdminNotification,
} = require("../services/notification.service");

const ADMIN_STATUSES = ["Pending", "Active", "Inactive"];
const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_ATTEMPT_RETENTION_MS = 24 * 60 * 60 * 1000;
const LOGIN_ALERT_THRESHOLD = 7;

const getRequestIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  const forwardedIp =
    typeof forwarded === "string" ? forwarded.split(",")[0].trim() : "";
  return forwardedIp || req.ip || req.socket?.remoteAddress || "unknown";
};

const maskIpAddress = (ipAddress) => {
  if (!ipAddress || ipAddress === "unknown") return "unknown IP";

  if (ipAddress.includes(".")) {
    const parts = ipAddress.split(".");
    return parts.length === 4
      ? `${parts[0]}.${parts[1]}.${parts[2]}.*`
      : "masked IP";
  }

  if (ipAddress.includes(":")) {
    return `${ipAddress.split(":").slice(0, 3).join(":")}:*`;
  }

  return "masked IP";
};

const recordFailedLogin = async (req, email) => {
  try {
    const now = new Date();
    const normalizedEmail = String(email || "unknown").trim().toLowerCase();
    const ipAddress = getRequestIp(req);
    let attempt = await AdminLoginAttempt.findOne({
      email: normalizedEmail,
      ipAddress,
    });

    if (
      !attempt ||
      now.getTime() - attempt.firstAttemptAt.getTime() >
        LOGIN_ATTEMPT_WINDOW_MS
    ) {
      attempt = await AdminLoginAttempt.findOneAndUpdate(
        { email: normalizedEmail, ipAddress },
        {
          $set: {
            count: 1,
            firstAttemptAt: now,
            lastAttemptAt: now,
            alertedAt: null,
            expiresAt: new Date(now.getTime() + LOGIN_ATTEMPT_RETENTION_MS),
          },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    } else {
      attempt.count += 1;
      attempt.lastAttemptAt = now;
      attempt.expiresAt = new Date(
        now.getTime() + LOGIN_ATTEMPT_RETENTION_MS
      );
      await attempt.save();
    }

    if (attempt.count >= LOGIN_ALERT_THRESHOLD) {
      const claimedAlert = await AdminLoginAttempt.findOneAndUpdate(
        { _id: attempt._id, alertedAt: null },
        { $set: { alertedAt: now } },
        { new: true }
      );

      if (!claimedAlert) return;

      await createAdminNotification({
        type: "security",
        category: "general",
        title: "Repeated failed admin login",
        message: `${claimedAlert.count} failed login attempts for ${normalizedEmail} from ${maskIpAddress(
          ipAddress
        )} within 15 minutes.`,
        metadata: {
          email: normalizedEmail,
          ipAddress,
          attemptCount: claimedAlert.count,
        },
      });
    }
  } catch (error) {
    console.error("Failed admin login could not be recorded:", error.message);
  }
};

const clearFailedLogins = async (email) => {
  try {
    await AdminLoginAttempt.deleteMany({
      email: String(email || "").trim().toLowerCase(),
    });
  } catch (error) {
    console.error("Admin login attempts could not be cleared:", error.message);
  }
};

// register
const registerAdmin = async (req, res,next) => {
  try {
    const isAdded = await Admin.findOne({ email: req.body.email });
    if (isAdded) {
      return res.status(403).send({
        message: "This Email already Added!",
      });
    } else {
      const newStaff = new Admin({
        name: req.body.name,
        email: req.body.email,
        role: "Admin",
        status: "Pending",
        password: bcrypt.hashSync(req.body.password),
      });
      const staff = await newStaff.save();
      await createAdminNotification({
        type: "staff",
        category: "staff",
        title: "New staff approval request",
        message: `${staff.name} (${staff.email}) registered and is waiting for approval.`,
        link: `/our-staff/${staff._id}`,
        entityId: staff._id,
        metadata: {
          name: staff.name,
          email: staff.email,
          status: staff.status,
        },
      });

      res.status(201).send({
        message: "Registration submitted. Please wait for admin approval.",
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        status: staff.status,
        joiningData: Date.now(),
      });
    }
  } catch (err) {
    next(err)
  }
};
// login admin
const loginAdmin = async (req, res,next) => {
  // console.log(req.body)
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    // console.log(admin)
    if (admin && bcrypt.compareSync(req.body.password, admin.password)) {
      if (admin.status === "Pending") {
        return res.status(403).send({
          message: "Your admin account is pending approval.",
        });
      }

      if (admin.status === "Inactive") {
        return res.status(403).send({
          message: "Your admin account is inactive. Please contact an administrator.",
        });
      }

      if (admin.status !== "Active") {
        return res.status(403).send({
          message: "Your admin account is not approved.",
        });
      }

      await clearFailedLogins(admin.email);
      const token = generateToken(admin);
      res.send({
        token,
        _id: admin._id,
        name: admin.name,
        phone: admin.phone,
        email: admin.email,
        image: admin.image,
        role: admin.role,
        status: admin.status,
      });
    } else {
      await recordFailedLogin(req, req.body.email);
      res.status(401).send({
        message: "Invalid Email or password!",
      });
    }
  } catch (err) {
    next(err)
  }
};
// forget password
const forgetPassword = async (req, res,next) => {
  try {
    const { email } = req.body;
    // console.log('email--->',email)
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(404).send({
        message: "Admin Not found with this email!",
      });
    } else {
      const token = tokenForVerify(admin);
      const body = {
        from: secret.email_user,
        to: `${email}`,
        subject: "Password Reset",
        html: `<h2>Hello ${email}</h2>
        <p>A request has been received to change the password for your <strong>Supplefied</strong> account </p>

        <p>This link will expire in <strong> 10 minute</strong>.</p>

        <p style="margin-bottom:20px;">Click this link for reset your password</p>

        <a href=${secret.admin_url}/forget-password/${token} style="background:#0989FF;color:white;border:1px solid #0989FF; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password</a>

        <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@supplefied.com</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong>Supplefied Team</strong>
        `,
      };
      admin.confirmationToken = token;
      const date = new Date();
      date.setDate(date.getDate() + 1);
      admin.confirmationTokenExpires = date;
      await admin.save({ validateBeforeSave: false });
      const message = "Please check your email to reset password!";
      sendEmail(body, res, message);
    }
  } catch (error) {
    next(error)
  }
};
// confirm-forget-password
const confirmAdminForgetPass = async (req, res,next) => {
  try {
    const { token, password } = req.body;
    const admin = await Admin.findOne({ confirmationToken: token });

    if (!admin) {
      return res.status(403).json({
        status: "fail",
        message: "Invalid token",
      });
    }

    const expired = new Date() > new Date(user.confirmationTokenExpires);

    if (expired) {
      return res.status(401).json({
        status: "fail",
        message: "Token expired",
      });
    } else {
      const newPassword = bcrypt.hashSync(password);
      await Admin.updateOne(
        { confirmationToken: token },
        { $set: { password: newPassword } }
      );

      admin.confirmationToken = undefined;
      admin.confirmationTokenExpires = undefined;

      await admin.save({ validateBeforeSave: false });

      res.status(200).json({
        message: "Password reset successfully",
      });
    }
  } catch (error) {
    next(error)
  }
};

// change password
const changePassword = async (req,res,next) => {
  try {
    const {email,oldPass,newPass} = req.body || {};
    const admin = await Admin.findOne({ email: email });
    // Check if the admin exists
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    if(!bcrypt.compareSync(oldPass, admin.password)){
      return res.status(401).json({ message: "Incorrect current password" });
    }
    else {
      const hashedPassword = bcrypt.hashSync(newPass);
      await Admin.updateOne({email:email},{password:hashedPassword})
      res.status(200).json({ message: "Password changed successfully" });
    }
  } catch (error) {
    next(error)
  }
}
// reset Password
const resetPassword = async (req, res) => {
  const token = req.body.token;
  const { email } = jwt.decode(token);
  const staff = await Admin.findOne({ email: email });

  if (token) {
    jwt.verify(token,secret.jwt_secret_for_verify,(err, decoded) => {
      if (err) {
        return res.status(500).send({
          message: "Token expired, please try again!",
        });
      } else {
        staff.password = bcrypt.hashSync(req.body.newPassword);
        staff.save();
        res.send({
          message: "Your password change successful, you can login now!",
        });
      }
    });
  }
};
// add staff
const addStaff = async (req, res,next) => {
  try {
    const isAdded = await Admin.findOne({ email: req.body.email });
    if (isAdded) {
      return res.status(500).send({
        message: "This Email already Added!",
      });
    } else {
      const newStaff = new Admin({
        name:req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        phone: req.body.phone,
        joiningDate: req.body.joiningDate,
        role: req.body.role,
        status: "Active",
        image: req.body.image,
      });
      await newStaff.save();
      res.status(200).send({
        message: "Staff Added Successfully!",
      });
    }
  } catch (err) {
    next(err)
  }
};
// get all staff
const getAllStaff = async (req, res,next) => {
  try {
    const admins = await Admin.find({}).sort({ _id: -1 });
    res.status(200).json({
      status:true,
      message:'Staff get successfully',
      data:admins
    });
  } catch (err) {
    next(err)
  }
};
// getStaffById
const getStaffById = async (req, res,next) => {
  // console.log('getStaffById',req.params.id)
  try {
    const admin = await Admin.findById(req.params.id);
    res.send(admin);
  } catch (err) {
    next(err)
  }
};
// updateStaff
const updateStaff = async (req, res) => {
  try {
    const admin = await Admin.findOne({ _id: req.params.id });
    if (admin) {
      admin.name = req.body.name;
      admin.email = req.body.email;
      admin.phone = req.body.phone;
      admin.role = req.body.role;
      admin.joiningData = req.body.joiningDate;
      admin.image = req.body.image;
      admin.password =
      req.body.password !== undefined
        ? bcrypt.hashSync(req.body.password)
        : admin.password;
      const updatedAdmin = await admin.save();
      const token = generateToken(updatedAdmin);
      res.send({
        token,
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        image: updatedAdmin.image,
        phone: updatedAdmin.phone,
      });
    } else {
      res.status(404).send({
        message: "This Staff not found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
// deleteStaff
const deleteStaff = async (req, res,next) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message:'Admin Deleted Successfully',
    });
  } catch (err) {
    next(err)
  }
};

const updatedStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;

    if (!ADMIN_STATUSES.includes(newStatus)) {
      return res.status(400).send({
        message: "Invalid admin status",
      });
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      { $set: { status: newStatus } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedAdmin) {
      return res.status(404).send({
        message: "Admin not found",
      });
    }

    res.send({
      message: `Admin ${newStatus} successfully!`,
      data: updatedAdmin,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  forgetPassword,
  resetPassword,
  addStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  updatedStatus,
  changePassword,
  confirmAdminForgetPass,
};
