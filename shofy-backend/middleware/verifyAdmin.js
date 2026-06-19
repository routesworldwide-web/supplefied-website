const jwt = require("jsonwebtoken");
const Admin = require("../model/Admin");
const { secret } = require("../config/secret");

// Admin routes need a live, approved account, not only a valid JWT.
module.exports = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")?.[1];

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in",
      });
    }

    const decoded = jwt.verify(token, secret.token_secret);
    const admin = await Admin.findById(decoded._id).select("-password");

    if (!admin) {
      return res.status(401).json({
        status: "fail",
        message: "Admin account not found",
      });
    }

    if (admin.status !== "Active") {
      return res.status(403).json({
        status: "fail",
        message: "Admin account is not approved",
      });
    }

    req.user = decoded;
    req.admin = admin;
    next();
  } catch (error) {
    res.status(403).json({
      status: "fail",
      message: "Invalid token",
    });
  }
};
