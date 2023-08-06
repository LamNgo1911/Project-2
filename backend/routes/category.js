const {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
  getSingleCategoryProducts,
  uploadImage,
} = require("../controllers/category");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/auth");

const express = require("express");
const router = express.Router();

router
  .route("/")
  .post([authenticateUser, authorizePermissions("admin")], createCategory)
  .get(getAllCategories);

router
  .route("/uploadImage")
  .post([authenticateUser, authorizePermissions("admin")], uploadImage);

router
  .route("/:id")
  .get(authenticateUser, getSingleCategory)
  .patch([authenticateUser, authorizePermissions("admin")], updateCategory)
  .delete([authenticateUser, authorizePermissions("admin")], deleteCategory);

router.route("/:id/products").get(getSingleCategoryProducts);
module.exports = router;
