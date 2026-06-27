const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../model/User");
const UserLoginAttempt = require("../model/UserLoginAttempt");
const { sendEmail } = require("../config/email");
const { generateToken, tokenForVerify } = require("../utils/token");
const { secret } = require("../config/secret");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(secret.google_client_id);
const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_ATTEMPT_RETENTION_MS = 24 * 60 * 60 * 1000;
const LOGIN_CAPTCHA_THRESHOLD = 3;

const CHECKOUT_ADDRESS_FIELDS = [
  "firstName",
  "lastName",
  "country",
  "address",
  "city",
  "zipCode",
  "contactNo",
  "email",
  "orderNote",
];

const REQUIRED_ADDRESS_FIELDS = CHECKOUT_ADDRESS_FIELDS.filter(
  (field) => field !== "orderNote"
);

const normalizeShippingAddress = (data = {}) => {
  return CHECKOUT_ADDRESS_FIELDS.reduce((address, field) => {
    const value = data[field];
    address[field] = typeof value === "string" ? value.trim() : value;
    return address;
  }, {});
};

const normalizeEmail = (email = "") => email.trim().toLowerCase();
const normalizeText = (value = "") => (typeof value === "string" ? value.trim() : "");
const normalizeMobileNumber = (value = "") => {
  const trimmedValue = normalizeText(value);
  const hasCountryPrefix = trimmedValue.startsWith("+");
  const digits = trimmedValue.replace(/[^\d]/g, "");

  return `${hasCountryPrefix ? "+" : ""}${digits}`;
};

const getRequestIp = (req) => req.ip || req.socket?.remoteAddress || "unknown";

const recordFailedLogin = async (req, email) => {
  const now = new Date();
  const normalizedEmail = normalizeEmail(email || "unknown");
  const ipAddress = getRequestIp(req);
  let attempt = await UserLoginAttempt.findOne({
    email: normalizedEmail,
    ipAddress,
  });

  if (
    !attempt ||
    now.getTime() - attempt.firstAttemptAt.getTime() >
      LOGIN_ATTEMPT_WINDOW_MS
  ) {
    attempt = await UserLoginAttempt.findOneAndUpdate(
      { email: normalizedEmail, ipAddress },
      {
        $set: {
          count: 1,
          firstAttemptAt: now,
          lastAttemptAt: now,
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

  return attempt;
};

const clearFailedLogins = async (email) => {
  try {
    await UserLoginAttempt.deleteMany({ email: normalizeEmail(email) });
  } catch (error) {
    // Login should still succeed if attempt-history cleanup temporarily fails.
    console.error("User login attempts could not be cleared:", error.message);
  }
};

const addAuthProvider = (user, provider) => {
  const providers = new Set(user.authProviders || []);
  providers.add(provider);
  user.authProviders = Array.from(providers);
};

const toSafeUser = (user) => {
  const { password: pwd, ...safeUser } = user.toObject();
  return safeUser;
};

// register user
// sign up
exports.signup = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const name = normalizeText(req.body.name);
    const password = req.body.password;
    const contactNumber = normalizeMobileNumber(req.body.contactNumber);

    if (!name || !email || !password || !contactNumber) {
      return res.status(400).json({
        status: "fail",
        message: "Name, email, password, and mobile number are required",
      });
    }

    if (!validator.isMobilePhone(contactNumber, "any")) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a valid mobile number",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ status: "fail", message: "Email already exists" });
    } else {
      const saved_user = await User.create({
        name,
        email,
        password,
        contactNumber,
        authProviders: ["password"],
      });
      const token = saved_user.generateConfirmationToken();

      await saved_user.save({ validateBeforeSave: false });

      const mailData = {
        from: secret.email_user,
        to: `${email}`,
        subject: "Verify Your Email",
        html: `<h2>Hello ${name}</h2>
        <p>Verify your email address to complete the signup and login into your <strong>Supplefied</strong> account.</p>
  
          <p>This link will expire in <strong> 10 minute</strong>.</p>
  
          <p style="margin-bottom:20px;">Click this link for active your account</p>
  
          <a href="${secret.client_url}/email-verify/${token}" style="background:#0989FF;color:white;border:1px solid #0989FF; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Verify Account</a>
  
          <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@supplefied.com</p>
  
          <p style="margin-bottom:0px;">Thank you</p>
          <strong>Supplefied Team</strong>
           `,
      };
      await sendEmail(mailData);

      return res.status(201).json({
        status: "success",
        message: "Please check your email to verify!",
      });
    }
  } catch (error) {
    next(error)
  }
};

/**
 * 1. Check if Email and password are given
 * 2. Load user with email
 * 3. if not user send res
 * 4. compare password
 * 5. if password not correct send res
 * 6. check if user is active
 * 7. if not active send res
 * 8. generate token
 * 9. send user and token
 */
module.exports.login = async (req, res, next) => {
  try {
    const { password } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!email || !password) {
      return res.status(401).json({
        status: "fail",
        error: "Please provide your credentials",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      const attempt = await recordFailedLogin(req, email);
      return res.status(401).json({
        status: "fail",
        error: "No user found. Please create an account",
        captchaRequired: attempt.count >= LOGIN_CAPTCHA_THRESHOLD,
      });
    }

    if (!user.password) {
      return res.status(403).json({
        status: "fail",
        error: "This account does not have a password. Please sign in with Google or reset your password.",
      });
    }

    const isPasswordValid = user.comparePassword(password, user.password);

    if (!isPasswordValid) {
      const attempt = await recordFailedLogin(req, email);
      return res.status(403).json({
        status: "fail",
        error: "Password is not correct",
        captchaRequired: attempt.count >= LOGIN_CAPTCHA_THRESHOLD,
      });
    }

    if (user.status != "active") {
      return res.status(401).json({
        status: "fail",
        error: "Your account is not active yet.",
      });
    }

    const token = generateToken(user);
    await clearFailedLogins(email);

    res.status(200).json({
      status: "success",
      message: "Successfully logged in",
      data: {
        user: toSafeUser(user),
        token,
      },
    });
  } catch (error) {
    next(error)
  }
};

// confirmEmail
exports.confirmEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ confirmationToken: token });

    if (!user) {
      return res.status(403).json({
        status: "fail",
        error: "Invalid token",
      });
    }

    const expired = new Date() > new Date(user.confirmationTokenExpires);

    if (expired) {
      return res.status(401).json({
        status: "fail",
        error: "Token expired",
      });
    }

    user.status = "active";
    user.emailVerified = true;
    user.confirmationToken = undefined;
    user.confirmationTokenExpires = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Successfully activated your account.",
    });
  } catch (error) {
    next(error)
  }
};

// forgetPassword
exports.forgetPassword = async (req, res, next) => {
  try {
    const verifyEmail = normalizeEmail(req.body.verifyEmail);
    const user = await User.findOne({ email: verifyEmail });
    if (!user) {
      return res.status(404).send({
        message: "User Not found with this email!",
      });
    } else {
      const token = tokenForVerify(user);
      const body = {
        from: secret.email_user,
        to: `${verifyEmail}`,
        subject: "Password Reset",
        html: `<h2>Hello ${verifyEmail}</h2>
        <p>A request has been received to change the password for your <strong>Supplefied</strong> account </p>

        <p>This link will expire in <strong> 10 minute</strong>.</p>

        <p style="margin-bottom:20px;">Click this link for reset your password</p>

        <a href=${secret.client_url}/forget-password/${token} style="background:#0989FF;color:white;border:1px solid #0989FF; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password</a>

        <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@supplefied.com</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong>Supplefied Team</strong>
        `,
      };
      user.confirmationToken = token;
      const date = new Date();
      date.setDate(date.getDate() + 1);
      user.confirmationTokenExpires = date;
      await user.save({ validateBeforeSave: false });
      await sendEmail(body);

      return res.status(200).json({
        status: "success",
        message: "Please check your email to reset password!",
      });
    }
  } catch (error) {
    next(error)
  }
};

// confirm-forget-password
exports.confirmForgetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({ confirmationToken: token });

    if (!user) {
      return res.status(403).json({
        status: "fail",
        error: "Invalid token",
      });
    }

    const expired = new Date() > new Date(user.confirmationTokenExpires);

    if (expired) {
      return res.status(401).json({
        status: "fail",
        error: "Token expired",
      });
    } else {
      user.password = password;
      addAuthProvider(user, "password");
      user.confirmationToken = undefined;
      user.confirmationTokenExpires = undefined;

      await user.save();

      res.status(200).json({
        status: "success",
        message: "Password reset successfully",
      });
    }
  } catch (error) {
    next(error)
  }
};

// change password
exports.changePassword = async (req, res, next) => {
  try {
    const { password, newPassword } = req.body || {};
    const user = await User.findById(req.user._id).select("+password authProviders");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const hasPasswordProvider = (user.authProviders || []).includes("password") && user.password;

    if (hasPasswordProvider && !bcrypt.compareSync(password || "", user.password || "")) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    user.password = newPassword;
    addAuthProvider(user, "password");
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error)
  }
};

// update a profile
exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (req.user._id !== userId) {
      return res.status(403).json({ message: "You can only update your own profile" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (typeof req.body.email === "string") {
      const email = normalizeEmail(req.body.email);
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });

      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use" });
      }

      user.email = email;
    }

    ["name", "address", "bio"].forEach((field) => {
      if (typeof req.body[field] === "string") {
        user[field] = req.body[field].trim();
      }
    });

    if (typeof req.body.contactNumber === "string") {
      user.contactNumber = normalizeMobileNumber(req.body.contactNumber);
    }

    const updatedUser = await user.save();
    const token = generateToken(updatedUser);
    res.status(200).json({
      status: "success",
      message: "Successfully updated profile",
      data: {
        user: toSafeUser(updatedUser),
        token,
      },
    });
  } catch (error) {
    next(error)
  }
};

exports.getShippingAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("shippingAddresses");

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: user.shippingAddresses || [],
    });
  } catch (error) {
    next(error);
  }
};

exports.addShippingAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("shippingAddresses");

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    if ((user.shippingAddresses || []).length >= 3) {
      return res.status(400).json({
        status: "fail",
        message: "You can save up to 3 shipping addresses",
      });
    }

    const shippingAddress = normalizeShippingAddress(req.body);
    const missingField = REQUIRED_ADDRESS_FIELDS.find((field) => !shippingAddress[field]);

    if (missingField) {
      return res.status(400).json({
        status: "fail",
        message: `${missingField} is required`,
      });
    }

    user.shippingAddresses.push(shippingAddress);
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      status: "success",
      message: "Shipping address saved successfully",
      data: user.shippingAddresses,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateShippingAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("shippingAddresses");

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const shippingAddress = user.shippingAddresses.id(req.params.addressId);

    if (!shippingAddress) {
      return res.status(404).json({
        status: "fail",
        message: "Shipping address not found",
      });
    }

    const updatedAddress = normalizeShippingAddress(req.body);
    const missingField = REQUIRED_ADDRESS_FIELDS.find((field) => !updatedAddress[field]);

    if (missingField) {
      return res.status(400).json({
        status: "fail",
        message: `${missingField} is required`,
      });
    }

    CHECKOUT_ADDRESS_FIELDS.forEach((field) => {
      shippingAddress[field] = updatedAddress[field];
    });

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Shipping address updated successfully",
      data: user.shippingAddresses,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteShippingAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("shippingAddresses");

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const shippingAddress = user.shippingAddresses.id(req.params.addressId);

    if (!shippingAddress) {
      return res.status(404).json({
        status: "fail",
        message: "Shipping address not found",
      });
    }

    shippingAddress.deleteOne();
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Shipping address removed successfully",
      data: user.shippingAddresses,
    });
  } catch (error) {
    next(error);
  }
};

// signUpWithProvider
exports.signUpWithProvider = async (req, res, next) => {
  try {
    if (!secret.google_client_id) {
      return res.status(503).json({
        status: "fail",
        error: "Google authentication is not configured",
      });
    }

    if (!req.body.credential) {
      return res.status(400).json({
        status: "fail",
        error: "Google credential is required",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: req.body.credential,
      audience: secret.google_client_id,
    });
    const googleUser = ticket.getPayload();

    if (!googleUser?.email || !googleUser.email_verified) {
      return res.status(401).json({
        status: "fail",
        error: "Google account email is not verified",
      });
    }

    const email = normalizeEmail(googleUser.email);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      addAuthProvider(existingUser, "google");
      existingUser.googleId = googleUser.sub || existingUser.googleId;
      existingUser.emailVerified = true;
      existingUser.status = "active";

      if (!existingUser.imageURL && googleUser.picture) {
        existingUser.imageURL = googleUser.picture;
      }

      await existingUser.save({ validateBeforeSave: false });

      const token = generateToken(existingUser);
      res.status(200).send({
        status: "success",
        data: {
          token,
          user: {
            ...toSafeUser(existingUser),
            googleSignIn: true,
          },
        },
      });
    } else {
      const newUser = new User({
        name: googleUser.name,
        email,
        imageURL: googleUser.picture,
        googleId: googleUser.sub,
        authProviders: ["google"],
        emailVerified: true,
        status: "active",
      });

      const signUpUser = await newUser.save();
      const token = generateToken(signUpUser);
      res.status(200).send({
        status: "success",
        data: {
          token,
          user: {
            ...toSafeUser(signUpUser),
            googleSignIn: true,
          }
        },
      });
    }
  } catch (error) {
    next(error)
  }
};
