const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/auth");

const express = require("express");
const router = express.Router();

const {
  createDeal,
  getAllDeals,
  getSingleDeal,
  updateDeal,
  deleteDeal,
  getSingleDealProducts,
} = require("../controllers/deal");

router
  .route("/")
  .post([authenticateUser, authorizePermissions("admin")], createDeal)
  .get(getAllDeals);

router
  .route("/:id")
  .get(authenticateUser, getSingleDeal)
  .patch([authenticateUser, authorizePermissions("admin")], updateDeal)
  .delete([authenticateUser, authorizePermissions("admin")], deleteDeal);
router.route("/:id/products").get(authenticateUser, getSingleDealProducts);

module.exports = router;
