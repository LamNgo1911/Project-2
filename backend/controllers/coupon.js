const Coupon = require("../models/coupon");
const ErrorResponse = require("../utils/errorResponse");
const { StatusCodes } = require("http-status-codes");
const Product = require("../models/product");

const createCoupon = async (req, res, next) => {
  const coupon = await Coupon.create(req.body);

  res.status(StatusCodes.CREATED).json({ coupon });
};

const getAllCoupons = async (req, res, next) => {
  const { search } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let coupons;
  const count = await Coupon.estimatedDocumentCount();
  const pageCount = Math.ceil(count / limit);

  if (search) {
    coupons = await Coupon.find({ code: { $regex: search, $options: "i" } })
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);
  } else {
    coupons = await Coupon.find({}).sort("-createdAt").skip(skip).limit(limit);
  }

  res
    .status(StatusCodes.CREATED)
    .json({ coupons, pagination: { count, pageCount } });
};

const getSingleCoupon = async (req, res, next) => {
  const { id } = req.params;

  const coupon = await Coupon.findOne({ _id: id });

  if (!coupon) {
    throw new ErrorResponse(`No coupon found with id: ${id}`);
  }
  res.status(StatusCodes.OK).json({ coupon });
};

const updateCoupon = async (req, res, next) => {
  const { id } = req.params;

  const coupon = await Coupon.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!coupon) {
    throw new ErrorResponse(`No coupon found with id: ${id}`);
  }

  res.status(StatusCodes.OK).json({ coupon });
};

const deleteCoupon = async (req, res, next) => {
  const { id } = req.params;

  const coupon = await Coupon.findByIdAndDelete({ _id: id });

  if (!coupon) {
    throw new ErrorResponse(`No coupon found with id: ${id}`);
  }

  res.status(StatusCodes.OK).json({ coupon });
};

const getSingleCouponProducts = async (req, res, next) => {
  const { id } = req.params;

  const coupon = await Coupon.findByIdAndDelete({ _id: id });

  if (!category) {
    throw new ErrorResponse(`No coupon found with id: ${id}`);
  }
  const products = await Product.find({ coupon: coupon?.code });
};

module.exports = {
  createCoupon,
  getAllCoupons,
  getSingleCoupon,
  updateCoupon,
  deleteCoupon,
  getSingleCouponProducts,
};
