const User = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");
const sendTokenResponse = require("../utils/sendTokenResponse");
const { StatusCodes } = require("http-status-codes");
const checkPermissions = require("../utils/checkPermissions");
const userController = {};

userController.getAllUsers = async (req, res, next) => {
  const { filter, search } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  let users;
  const count = await User.estimatedDocumentCount();
  const pageCount = Math.ceil(count / limit);
  if (search) {
    users = await User.find({ name: { $regex: search, $options: "i" } })
      .select("-password")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);
  } else {
    users = await User.find({ role: "user" })
      .select("-password")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);
  }
  if (filter === "Active") {
    users = users.filter((user) => user?.status === true);
  } else if (filter === "Disabled") {
    users = users.filter((user) => user?.status === false);
  }

  res.status(StatusCodes.OK).json({ users, pagination: { count, pageCount } });
};

userController.compareMonthlyUsers = async (req, res, next) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Calculate the start and end dates for the current month
  const currentMonthStartDate = new Date(currentYear, currentMonth, 1);
  const currentMonthEndDate = new Date(currentYear, currentMonth + 1, 0);

  // Calculate the start and end dates for the last month
  const lastMonthStartDate = new Date(currentYear, currentMonth - 1, 1);
  const lastMonthEndDate = new Date(currentYear, currentMonth, 0);

  try {
    // Fetch users registered within the last month
    const lastMonthUsers = await User.find({
      createdAt: { $gte: lastMonthStartDate, $lte: lastMonthEndDate },
    });

    // Fetch users registered for the current month
    const currentMonthUsers = await User.find({
      createdAt: { $gte: currentMonthStartDate, $lte: currentMonthEndDate },
    });

    // const lastMonthTotalUsers = lastMonthUsers.length;
    // const currentMonthTotalUsers = currentMonthUsers.length;

    // Calculate the percentage difference with a check for division by zero

    res.status(StatusCodes.OK).json({
      lastMonthUsers,
      currentMonthUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Unable to fetch users." });
  }
};

userController.getSingleUser = async (req, res, next) => {
  const user = await User.findById({ _id: req.params.id }).select("-password");

  if (!user) {
    throw new ErrorResponse(
      `No user found with id: ${req.params.id}`,
      StatusCodes.NOT_FOUND
    );
  }

  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

userController.getCurrentUser = async (req, res, next) => {
  res.status(200).json({ user: req.user });
};

// update user with user.save()
userController.UpdateUser = async (req, res, next) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new ErrorResponse(
      "Please provide both values",
      StatusCodes.BAD_REQUEST
    );
  }

  const user = await User.findOneAndUpdate({ _id: req.user.id });

  user.name = name;
  user.email = email;

  await user.save();
  sendTokenResponse(user, StatusCodes.OK, res);
};

userController.UpdateUserPassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ErrorResponse(
      "Please provide both values",
      StatusCodes.BAD_REQUEST
    );
  }

  const user = await User.findOne({ _id: req.user.id }).select("+password");
  console.log(oldPassword);
  const isMatchPassword = await user.matchPassword(oldPassword);
  if (!isMatchPassword) {
    throw new ErrorResponse("Invalid credentials", StatusCodes.UNAUTHORIZED);
  }

  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated." });
};

// @desc    disable user
// @route   POST /api/v1/users/:id/disable
// @access  private
userController.disableUser = async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id });

  if (!user.status) {
    throw new ErrorResponse("User account is already disabled.");
  }

  user.status = false;

  await user.save();

  res.status(StatusCodes.OK).json({ message: "User account disabled." });
};

// @desc    activate user
// @route   POST /api/v1/users/:id/activate
// @access  private
userController.activateUser = async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id });

  if (user.status) {
    throw new ErrorResponse("User account is already active.");
  }

  user.status = true;

  await user.save();

  res.status(StatusCodes.OK).json({ message: "User account activated." });
};

module.exports = userController;
