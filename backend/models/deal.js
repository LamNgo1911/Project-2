const mongoose = require("mongoose");

const DealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add deal title"],
    },
    description: {
      type: String,
      required: [true, "Please add deal description"],
    },
    discount: {
      type: Number,
      required: [true, "Please add deal discount"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Deal", DealSchema);
