const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require("../controllers/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/verify-otp").post(verifyOtp);
router.route("/reset-password").post(resetPassword);

module.exports = router;
