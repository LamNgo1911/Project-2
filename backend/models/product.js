const mongoose = require("mongoose");

const ColorSchema = mongoose.Schema({
  color: {
    type: String,
    required: [true, "Please add the color name"],
  },
  images: [
    {
      type: String,
      required: [true, "Please add product images"],
    },
  ],
});

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add product name"],
    },
    price: {
      type: Number,
      required: [true, "Please add product price"],
    },
    description: {
      type: String,
      required: [true, "Please add product description"],
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    colors: {
      type: [ColorSchema],
    },
    sizes: {
      type: [String],
      required: [true, "Please add product sizes"],
    },
    averageRating: {
      type: Number,
      default: 5,
    },
    numberOfReviews: {
      type: Number,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deal: {
      type: mongoose.Types.ObjectId,
      ref: "Deal",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

ProductSchema.virtual("newPrice").get(function () {
  return this.price - (this.price * (this.deal?.discount || 0)) / 100;
});

ProductSchema.pre("remove", async function (next) {
  await this.model("Review").deleteMany({ product: this._id });
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
