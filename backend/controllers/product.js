const Product = require("../models/product");
const Category = require("../models/category");
const ErrorResponse = require("../utils/errorResponse");
const { StatusCodes } = require("http-status-codes");
const path = require("path");
const Review = require("../models/review");
const productController = {};

// create product
productController.createProduct = async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};
// get all products
productController.getAllProducts = async (req, res, next) => {
  const page = Number(req.query?.page) || 1;
  const limit = Number(req.query?.limit) || 8;
  const skip = (page - 1) * limit;
  const sort = req.query?.sort;
  const category = req.query?.category;
  const priceOption = req.query?.priceOption;
  const lowestPrice = req.query?.lowestPrice;
  const highestPrice = req.query?.highestPrice;
  const size = req.query?.size;
  const color = req.query?.color;
  const search = req.query?.search;

  let results = Product.find({}).populate("category deal");
  // sort
  if (sort === "Latest added" || sort === "Most Relevant") {
    results.sort({ createdAt: -1 });
  } else if (sort === "Lowest price") {
    results.sort({ price: 1 });
  } else if (sort === "Highest price") {
    results.sort({ price: -1 });
  } else if (sort === "Top reviews") {
    results.sort({ averageRating: -1 });
  } else if (sort) {
    results.sort(`${sort}`);
  }

  // Filter
  if (
    (category && category !== "All category") ||
    (category && category !== "All")
  ) {
    const cate = await Category.findOne({ name: category });
    if (cate) {
      results = results.find({ category: cate._id });
    }
  }

  if (priceOption === "Custom") {
    if (lowestPrice && highestPrice) {
      results = results.find({
        price: { $gte: lowestPrice, $lte: highestPrice },
      });
    } else if (lowestPrice) {
      results = results.find({ price: { $gte: lowestPrice } });
    } else if (highestPrice) {
      results = results.find({ price: { $lte: highestPrice } });
    }
  }
  if (size) {
    results = results.find({ sizes: { $in: [size.toLowerCase()] } });
  }
  if (color) {
    results = results.find({ colors: { $elemMatch: { color: color } } });
  }
  // search
  if (search) {
    results = results.find({ name: { $regex: search, $options: "i" } });
  }

  const count = await Product.countDocuments(results._conditions);
  const products = await results.skip(skip).limit(limit);
  const pageCount = Math.ceil(count / limit);

  res
    .status(StatusCodes.OK)
    .json({ products, pagination: { count, pageCount } });
};

// getSingleProduct
productController.getSingleProduct = async (req, res, next) => {
  const { id: productId } = req.params;

  const product = await Product.findById({ _id: productId }).populate(
    "reviews category deal"
  );
  if (!product) {
    throw new ErrorResponse(`No product found with id: ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};
//updateProduct
productController.updateProduct = async (req, res, next) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new ErrorResponse(`No product found with id: ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};
// deleteProduct
productController.deleteProduct = async (req, res, next) => {
  const { id: productId } = req.params;
  console.log("hi");
  const product = await Product.findById({ _id: productId });
  if (!product) {
    console.log("hello");
    throw new ErrorResponse(`No product found with id: ${productId}`);
  }

  await product.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Success! Product removed" });
};
//upload image
productController.uploadImage = async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new ErrorResponse("No files uploaded", StatusCodes.BAD_REQUEST);
  }

  const images = req.files.images;
  // console.log(images);

  if (!Array.isArray(images)) {
    throw new ErrorResponse("Please upload multiple images");
  }

  const maxSize = 1024 * 1024;
  const uploadedImages = [];

  for (let i = 0; i < images.length; i++) {
    const image = images[i];

    if (!image.mimetype.startsWith("image")) {
      throw new ErrorResponse(`File ${i + 1} is not an image`);
    }

    // if (image.size > maxSize) {
    //   console.log("hello");
    //   throw new ErrorResponse(`File ${i + 1} exceeds the maximum file size`);
    // }

    const imagePath = path.join(
      __dirname,
      "../public/productImage/",
      `${image.name}`
    );

    await image.mv(imagePath);
    uploadedImages.push(`/productImage/${image.name}`);
  }

  res.status(StatusCodes.OK).json({ images: uploadedImages });
};

productController.getSingleProductReviews = async (req, res, next) => {
  const page = Number(req.query?.page) || 1;
  const limit = Number(req.query?.limit) || 8;
  const skip = (page - 1) * limit;

  const { id: productId } = req.params;

  const countReviews = await Review.find({ product: productId });
  const reviews = await Review.find({ product: productId })
    .skip(skip)
    .limit(limit)
    .populate("user");

  if (!reviews) {
    throw new ErrorResponse(
      `No review found with id: ${productId}`,
      StatusCodes.NOT_FOUND
    );
  }

  const count = countReviews?.length;
  const pageCount = Math.ceil(count / limit);

  res
    .status(StatusCodes.OK)
    .json({ reviews, pagination: { count, pageCount } });
};
module.exports = productController;
