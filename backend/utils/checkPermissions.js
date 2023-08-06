const ErrorResponse = require("../utils/errorResponse");
const { StatusCodes } = require("http-status-codes");

const checkPermissions = (requestUser, resourceUserId) => {
  console.log(requestUser);
  console.log(resourceUserId);
  if (requestUser.role === "admin") return;
  if (requestUser.id === resourceUserId.toString()) return;

  throw new ErrorResponse(
    "Not authorized to this route",
    StatusCodes.UNAUTHORIZED
  );
};

module.exports = checkPermissions;
