const ErrorResponse = require("../utils/errorResponse");
const { StatusCodes } = require("http-status-codes");
const Review = require("../models/review");
const Product = require("../models/product");
const checkPermissions = require("../utils/checkPermissions");

const createReview = async (req, res, next) => {
  const { product: productId } = req.body;

  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new ErrorResponse(
      `No product found with id: ${productId}`,
      StatusCodes.NOT_FOUND
    );
  }

  const alreadySubmited = await Review.findOne({
    product: productId,
    user: req.user.id,
  });

  if (alreadySubmited) {
    throw new ErrorResponse(
      `Already submitted review with for this product`,
      StatusCodes.BAD_REQUEST
    );
  }

  req.body.user = req.user.id;

  const review = await Review.create(req.body);

  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res, next) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name price rating",
  });

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findOne({ _id: id }).populate({
    path: "product",
    select: "name price rating",
  });

  if (!review) {
    throw new ErrorResponse(
      `No review found with id: ${id}`,
      StatusCodes.BAD_REQUEST
    );
  }

  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res, next) => {
  const { id } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOneAndUpdate({ _id: id });

  if (!review) {
    throw new ErrorResponse(
      `No review found with id: ${id}`,
      StatusCodes.NOT_FOUND
    );
  }

  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findOneAndDelete({ _id: id });
  if (!review) {
    throw new ErrorResponse(
      `No review found with id: ${id}`,
      StatusCodes.NOT_FOUND
    );
  }
  checkPermissions(req.user, review.user);

  await review.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Deleted review" });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
