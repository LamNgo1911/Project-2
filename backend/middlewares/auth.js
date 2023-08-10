const jwt = require("jsonwebtoken");
// const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/user");

// Protect routes
 const authenticateUser = async (req, res, next) => {
  let token;
  console.log(req.headers.authorization)
  console.log(req.headers)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return next(new ErrorResponse("No token provided", 400));
  }

  try {
    // verify
   const { id, name, role, email } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id, name, role, email };
    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
};

// Protect routes
// const authenticateUser = async (req, res, next) => {
//   const token = req.signedCookies.token;
//   console.log(token);
//   if (!token) {
//     console.log("hello");
//     throw new ErrorResponse("Not authorized to access this route", 401);
//   }
//   try {
//     const { id, name, role, email } = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = { id, name, role, email };
//     next();
//   } catch (error) {
//     throw new ErrorResponse("Not authorized to access this route", 401);
//   }
// };

const authorizePermissions = (...roles) => {
  // console.log(roles);

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ErrorResponse("Unauthorized to access this route", 403);
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
