const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/auth");

const express = require("express");
const router = express.Router();

const {
  createCoupon,
  getAllCoupons,
  getSingleCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/coupon");

router
  .route("/")
  .post([authenticateUser, authorizePermissions("admin")], createCoupon)
  .get(getAllCoupons);

router
  .route("/:id")
  .get([authenticateUser], getSingleCoupon)
  .patch([authenticateUser, authorizePermissions("admin")], updateCoupon)
  .delete([authenticateUser, authorizePermissions("admin")], deleteCoupon);

module.exports = router;
