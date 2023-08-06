const Deal = require("../models/deal");
const Product = require("../models/product");
const ErrorResponse = require("../utils/errorResponse");
const { StatusCodes } = require("http-status-codes");

const createDeal = async (req, res, next) => {
  const deal = await Deal.create(req.body);

  res.status(StatusCodes.CREATED).json({ deal });
};

const getAllDeals = async (req, res, next) => {
  const { search } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let deals;
  const count = await Deal.estimatedDocumentCount();
  const pageCount = Math.ceil(count / limit);

  if (search) {
    deals = await Deal.find({ title: { $regex: search, $options: "i" } })
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);
  } else {
    deals = await Deal.find({}).sort("-createdAt").skip(skip).limit(limit);
  }

  res
    .status(StatusCodes.CREATED)
    .json({ deals, pagination: { count, pageCount } });
};

const getSingleDeal = async (req, res, next) => {
  const { id } = req.params;

  const deal = await Deal.findOne({ _id: id });

  if (!deal) {
    throw new ErrorResponse(`No deal found with id: ${id}`);
  }
  res.status(StatusCodes.OK).json({ deal });
};

const updateDeal = async (req, res, next) => {
  const { id } = req.params;

  const deal = await Deal.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!deal) {
    throw new ErrorResponse(`No deal found with id: ${id}`);
  }

  res.status(StatusCodes.OK).json({ deal });
};

const deleteDeal = async (req, res, next) => {
  const { id } = req.params;

  const deal = await Deal.findByIdAndDelete({ _id: id });

  if (!deal) {
    throw new ErrorResponse(`No deal found with id: ${id}`);
  }

  res.status(StatusCodes.OK).json({ deal });
};

const getSingleDealProducts = async (req, res, next) => {
  const { id } = req.params;

  const products = await Product.find({ category: id });

  if (!products || products.length < 1) {
    throw new ErrorResponse(
      `Category with id: ${categoryId} does not have products`,
      StatusCodes.NOT_FOUND
    );
  }

  res.StatusCodes(StatusCodes.OK).json({ products });
};
module.exports = {
  createDeal,
  getAllDeals,
  getSingleDeal,
  updateDeal,
  deleteDeal,
  getSingleDealProducts,
};
