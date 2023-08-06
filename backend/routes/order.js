const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrder,
  compareOrdersMonthly,
  fetchDailySalesData,
  fetchWeeklySalesData,
  fetchMonthlySalesData,
  fetchYearlySalesData,
  updateOrderStatus,
} = require("../controllers/order");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/auth");

router
  .route("/")
  .post(authenticateUser, createOrder)
  .get([authenticateUser, authorizePermissions("admin")], getAllOrders);

router.route("/showAllMyOrders").get(authenticateUser, getCurrentUserOrders);
router
  .route("/compareOrdersMonthly")
  .get([authenticateUser, authorizePermissions("admin")], compareOrdersMonthly);
router
  .route("/fetchDailySalesData")
  .get([authenticateUser, authorizePermissions("admin")], fetchDailySalesData);
router
  .route("/fetchWeeklySalesData")
  .get([authenticateUser, authorizePermissions("admin")], fetchWeeklySalesData);
router
  .route("/fetchMonthlySalesData")
  .get(
    [authenticateUser, authorizePermissions("admin")],
    fetchMonthlySalesData
  );
router
  .route("/fetchYearlySalesData")
  .get([authenticateUser, authorizePermissions("admin")], fetchYearlySalesData);

router
  .route("/:id")
  .patch(authenticateUser, updateOrder)
  .get(authenticateUser, getSingleOrder);

router
  .route("/:id/updateOrderStatus")
  .patch([authenticateUser], updateOrderStatus);
module.exports = router;
