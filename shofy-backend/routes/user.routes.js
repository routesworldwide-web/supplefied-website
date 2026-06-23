const express = require('express');
const router = express.Router();
const userController= require('../controller/user.controller');
const verifyToken = require('../middleware/verifyToken');
const UserLoginAttempt = require("../model/UserLoginAttempt");
const {
  requireTurnstile,
  requireTurnstileAfterFailures,
} = require("../middleware/verifyTurnstile");

const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_CAPTCHA_THRESHOLD = 3;

// add a user
router.post("/signup", requireTurnstile("register"), userController.signup);
// login
router.post(
  "/login",
  requireTurnstileAfterFailures({
    AttemptModel: UserLoginAttempt,
    threshold: LOGIN_CAPTCHA_THRESHOLD,
    windowMs: LOGIN_ATTEMPT_WINDOW_MS,
    expectedAction: "user-login",
  }),
  userController.login
);
// forget-password
router.patch(
  '/forget-password',
  requireTurnstile("forgot-password"),
  userController.forgetPassword
);
// confirm-forget-password
router.patch('/confirm-forget-password', userController.confirmForgetPassword);
// change password
router.patch('/change-password', verifyToken, userController.changePassword);
// confirmEmail
router.get('/confirmEmail/:token', userController.confirmEmail);
// updateUser
router.put('/update-user/:id', verifyToken, userController.updateUser);
router.get('/shipping-addresses', verifyToken, userController.getShippingAddresses);
router.post('/shipping-addresses', verifyToken, userController.addShippingAddress);
router.put('/shipping-addresses/:addressId', verifyToken, userController.updateShippingAddress);
router.delete('/shipping-addresses/:addressId', verifyToken, userController.deleteShippingAddress);
// register or login with google
router.post("/register", userController.signUpWithProvider);

module.exports = router;
