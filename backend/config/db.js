const mongoose = require("mongoose");

const connectDB = (uri) => {
  return mongoose
    .connect(uri)
    .then(() => console.log("Connected to mongoDB..."))
    .catch((err) => {
      console.log(err.message);
      process.exit(0);
    });
};

module.exports = connectDB;
