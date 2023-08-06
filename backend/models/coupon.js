const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Please add coupon code"],
    },
    discount: {
      type: Number,
      required: [true, "Please add discount coupon"],
    },
    expiry: {
      type: Date,
      required: true,
    },
    minAmount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coupon", CouponSchema);
