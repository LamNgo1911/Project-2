const express = require("express");
const app = express();
require("express-async-errors");
require("dotenv").config();
const cors = require("cors"); // Import the cors package

const port = process.env.PORT || 5000;
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const bodyParser = require("body-parser");

const allowedOrigins = [
  "http://localhost:5173",
  "https://jazzy-clafoutis-ca122c.netlify.app",
];

// Custom middleware to enable CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});

app.use(cors());
app.set("trust proxy", 1);
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(xss());
app.use(mongoSanitize());
app.use(bodyParser.text({ type: "/" }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));
app.use(fileUpload());
app.use(morgan("tiny"));
app.use(express.json());

// ... Rest of your code ...

// user routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const reviewRoutes = require("./routes/review");
const orderRoutes = require("./routes/order");
const couponRoutes = require("./routes/coupon");
const dealRoutes = require("./routes/deal");
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/deals", dealRoutes);
// error handler middleware and not found middleware
const notFound = require("./middlewares/notFound");
app.use(notFound);
const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

// connect to db
const connectDB = require("./config/db");
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};
start();
