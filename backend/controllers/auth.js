const transporter = require("../config/emailConfig");
const User = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");
const sendTokenResponse = require("../utils/sendTokenResponse");
const { StatusCodes } = require("http-status-codes");
const userController = {};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
userController.register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const emailAlreadyExists = await User.find({ email });
  if (emailAlreadyExists) {
    throw new ErrorResponse("Email already exists", StatusCodes.BAD_REQUEST);
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, StatusCodes.CREATED, res);
};
// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
userController.login = async (req, res, next) => {
  const { email, password } = req.body;
  // Validate email & password
  if (!email || !password) {
    throw new ErrorResponse(
      "Please provide an email and password",
      StatusCodes.BAD_REQUEST
    );
  }
  console.log(email, password);
  // Check for user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ErrorResponse("Invalid credentials", StatusCodes.UNAUTHORIZED);
  }
  // check user status
  if (!user.status) {
    throw new ErrorResponse(
      "User account is already disabled.",
      StatusCodes.FORBIDDEN
    );
  }
  // Check if password matches

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new ErrorResponse("Invalid credentials", StatusCodes.UNAUTHORIZED);
  }
  sendTokenResponse(user, 200, res);
};
// @desc    Log out user
// @route   POST /api/v1/auth/logout
// @access  Public
userController.logout = async (req, res, next) => {
  res.setHeader("Authorization", "");
  // res.cookie("token", "logout", {
  //   httpOnly: true,
  //   expires: new Date(Date.now()),
  // });
  // res.clearCookie("token");
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};
// @desc    forgotPassword user
// @route   POST /api/v1/auth/forgot-password
// @access  private
userController.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ErrorResponse(`No user found with email: ${email}`);
  }
  // Generate OTP
  function generateOTP(length) {
    let otp = "";
    const digits = "0123456789";
    const numDigits = digits.length;

    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * numDigits)];
    }

    return otp;
  }

  const otp = generateOTP(4);

  const otpExpiration = Date.now() + 60 * 1000;
  console.log(otp);
  user.otp = otp;
  user.otpExpiration = otpExpiration;

  // Send the email
  const mailOptions = {
    from: "van.schaefer@ethereal.email",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is: ${otp}`,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to send OTP" });
    } else {
      res.status(StatusCodes.OK).json({ message: "OTP sent successfully" });
    }
  });

  await user.save();
};
// @desc    verify-otp user
// @route   POST /api/v1/auth/verify-otp
// @access  private
userController.verifyOtp = async (req, res, next) => {
  const { otp } = req.body;
  const user = await User.findOne({ otp });

  if (!user) {
    throw new ErrorResponse(`No user found with otp: ${otp}`);
  }

  console.log(user.otp, otp, user.otpExpiration);
  if (user.otp === otp) {
    console.log("accepted");
    if (Date.now() <= user.otpExpiration) {
      res.status(StatusCodes.OK).json({ message: "OTP verified successfully" });
      console.log(1);
    } else {
      // OTP has expired
      res.status(StatusCodes.BAD_REQUEST).json({ message: "OTP has expired" });
      console.log(2);
    }
  }
};
// @desc    resetPassword user
// @route   POST /api/v1/auth/reset-password
// @access  private
userController.resetPassword = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  // Check if the user exists in the database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // Update the user's password
  user.password = password;
  await user.save();

  res.json({ message: "Password reset successful!" });
};

module.exports = userController;
