const mongoose = require("mongoose");

const SingleOrderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
  size: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
});

const ShippingInfo = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  StreetAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    tax: {
      type: Number,
      required: [true, "Please add tax"],
    },
    shippingFee: {
      type: Number,
      required: [true, "Please add shipping fee"],
    },
    subtotal: {
      type: Number,
      required: [true, "Please add subtotal"],
    },
    total: {
      type: Number,
      required: [true, "Please add total"],
    },
    orderItems: [SingleOrderItemSchema],
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "reviewed", "return"],
      required: [true, "Please add status"],
      default: "pending",
    },
    clientSecret: {
      type: String,
      required: [true, "Please add clientSecret"],
    },
    paymentIntentId: {
      type: String,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    shippingInfo: ShippingInfo,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
