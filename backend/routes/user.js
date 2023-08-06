const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getCurrentUser,
  getSingleUser,
  UpdateUser,
  UpdateUserPassword,
  disableUser,
  activateUser,
  compareMonthlyUsers
} = require("../controllers/user");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/auth");

router.route("/").get([authenticateUser, authorizePermissions("admin")], getAllUsers);
router.route("/compareMonthlyUsers").get([authenticateUser, authorizePermissions("admin")], compareMonthlyUsers);
router.route("/me").get(authenticateUser, getCurrentUser);
router.route("/updateUser").patch(authenticateUser, UpdateUser);
router.route("/updateUserPassword").patch(authenticateUser, UpdateUserPassword);
router.route("/:id").get(authenticateUser, getSingleUser);
router
  .route("/:id/disable")
  .post([authenticateUser, authorizePermissions("admin")], disableUser);
router
  .route("/:id/activate")
  .post([authenticateUser, authorizePermissions("admin")], activateUser);
module.exports = router;
