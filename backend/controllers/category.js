const ErrorResponse = require("../utils/errorResponse");
const { StatusCodes } = require("http-status-codes");
const Category = require("../models/category");
const Product = require("../models/product");
const path = require("path");

const createCategory = async (req, res, next) => {
  const { name, image } = req.body;
  const category = await Category.create({ name, image });

  res.status(StatusCodes.CREATED).json({ category });
};

const getAllCategories = async (req, res, next) => {
  const categories = await Category.find({}).sort({ name: 1 });

  res.status(StatusCodes.OK).json({ categories });
};

const getSingleCategory = async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findOne({ _id: id });

  if (!category) {
    throw new ErrorResponse(`No category found with id: ${id}`);
  }
  res.status(StatusCodes.OK).json({ category });
};

const updateCategory = async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new ErrorResponse(`No category found with id: ${id}`);
  }

  res.status(StatusCodes.OK).json({ category });
};

const deleteCategory = async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete({ _id: id });

  if (!category) {
    throw new ErrorResponse(`No category found with id: ${id}`);
  }

  res.status(StatusCodes.OK).json({ category });
};

const getSingleCategoryProducts = async (req, res, next) => {
  const { id } = req.params;
  const products = await Product.find({ category: id });
  // console.log(products);
  if (!products || products.length < 1) {
    throw new ErrorResponse(
      `Category with id: ${id} does not have products`,
      StatusCodes.NOT_FOUND
    );
  }

  res.status(StatusCodes.OK).json({ products });
};

const uploadImage = async (req, res, next) => {
  if (!req.files) {
    throw new ErrorResponse("No file uploaded", StatusCodes.BAD_REQUEST);
  }

  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith("image")) {
    throw new ErrorResponse("Please upload image");
  }

  const maxSize = 1024 * 1024;

  if (productImage.size > maxSize) {
    throw new ErrorResponse("Please upload image smaller than 1MB");
  }

  const imagePath = path.join(
    __dirname,
    "../public/categoryImage/" + `${productImage?.name}`
  );

  await productImage.mv(imagePath);

  res
    .status(StatusCodes.OK)
    .json({ image: `/categoryImage/${productImage.name}` });
};

module.exports = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
  getSingleCategoryProducts,
  uploadImage,
};
