const Order = require("../models/order");
const ErrorResponse = require("../utils/errorResponse");
const { StatusCodes } = require("http-status-codes");
const checkPermissions = require("../utils/checkPermissions");
const stripe = require("stripe")(
  "sk_test_51MJsP5KH2yzWbNLaJ2bUYxBoR63ltS2lAPznNQKkuxHBpgL3o8TC1NodcVMqBXKkjoRNTVX8QiQcJhS4D1mlPFYv00HoOW9iPM"
);

const createOrder = async (req, res, next) => {
  const { cartItems, tax, shippingFee, shippingInfo, paymentMethodId } =
    req.body;

  if (!cartItems || cartItems?.length < 1) {
    throw new ErrorResponse("No cart items provided", StatusCodes.BAD_REQUEST);
  }

  if (!tax || !shippingFee) {
    throw new ErrorResponse("Please provide tax and shipping fee");
  }
  let subtotal = 0;
  for (const item of cartItems) {
    // calculate subtotal
    subtotal += item?.amount * item?.price;
  }
  // calculate total
  const total = tax + shippingFee + subtotal;
  // get client secret
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total * 100,
    currency: "usd",
    payment_method: paymentMethodId,
  });

  const orderItems = cartItems?.map((item) => {
    const newItem = { ...item, product: item.id };
    return newItem;
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent?.client_secret,
    user: req.user.id,
    shippingInfo,
  });
  res.status(StatusCodes.CREATED).json({
    order,
    clientSecret: order.clientSecret,
    paymentIntentId: paymentIntent?.id,
  });
};

const getAllOrders = async (req, res, next) => {
  const page = Number(req.query?.page) || 1;
  const limit = Number(req.query?.limit) || 8;
  const skip = (page - 1) * limit;

  const search = req.query?.search;
  const status = req.query?.status;

  let aggregatePipeline = [];

  // Match by status if provided
  if (status) {
    aggregatePipeline.push({ $match: { status } });
  }

  // Search by email in shippingInfo
  if (search) {
    aggregatePipeline.push({
      $match: { "shippingInfo.email": { $regex: search, $options: "i" } },
    });
  }

  // Add sorting and pagination to the pipeline
  aggregatePipeline.push(
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit }
  );

  // Perform the aggregation
  const countAggregate = [...aggregatePipeline]; // Clone the pipeline for counting
  countAggregate.push({ $count: "count" });
  const countResult = await Order.aggregate(countAggregate);

  const count = countResult.length > 0 ? countResult[0].count : 0;

  const orders = await Order.aggregate(aggregatePipeline);

  const pageCount = Math.ceil(count / limit);

  res.status(StatusCodes.OK).json({ orders, pagination: { count, pageCount } });
};

const compareOrdersMonthly = async (req, res, next) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Calculate the start and end dates for the current month
  const currentMonthStartDate = new Date(currentYear, currentMonth, 1);
  const currentMonthEndDate = new Date(currentYear, currentMonth + 1, 0);

  // Calculate the start and end dates for the last month
  const lastMonthStartDate = new Date(currentYear, currentMonth - 1, 1);
  const lastMonthEndDate = new Date(currentYear, currentMonth, 0);

  try {
    // Fetch orders within the last month
    const lastMonthOrders = await Order.find({
      createdAt: { $gte: lastMonthStartDate, $lte: lastMonthEndDate },
    });

    // Fetch orders for the current month
    const currentMonthOrders = await Order.find({
      createdAt: { $gte: currentMonthStartDate, $lte: currentMonthEndDate },
    });

    // const lastMonthTotalOrders = lastMonthOrders.length;
    // const currentMonthTotalOrders = currentMonthOrders.length;

    res.status(StatusCodes.OK).json({
      lastMonthOrders,
      currentMonthOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Unable to fetch orders." });
  }
};

const getSingleOrder = async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findOne({ _id: id });

  if (!order) {
    throw new ErrorResponse(
      `No order found with id: ${id}`,
      StatusCodes.NOT_FOUND
    );
  }

  checkPermissions(req.user, order.user);

  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res, next) => {
  const { category } = req.query;
  let orders;
  const results = Order.find({ user: req.user.id })
    .sort("-createdAt")
    .populate("orderItems.product");

  console.log(category);
  if (category && category !== "all") {
    orders = await results.find({ status: category });
  } else {
    orders = await results.find({});
  }

  res.status(StatusCodes.OK).json({ orders });
};

const updateOrder = async (req, res, next) => {
  const { id } = req.params;
  const { paymentIntentId } = req.body;

  if (!paymentIntentId) {
    throw new ErrorResponse(
      `Please provide paymentIntentId`,
      StatusCodes.BAD_REQUEST
    );
  }

  // Retrieve the PaymentIntent from Stripe
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  // Confirm the PaymentIntent and charge the payment
  const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
    paymentIntent.id
  );

  if (confirmedPaymentIntent.status === "succeeded") {
    const order = await Order.findOne({ _id: id });

    if (!order) {
      throw new ErrorResponse(
        `No order found with id: ${id}`,
        StatusCodes.NOT_FOUND
      );
    }

    checkPermissions(req.user, order.user);

    order.paymentIntentId = paymentIntentId;
    order.status = "paid";

    order.save();

    return res
      .status(StatusCodes.OK)
      .json({ order, message: "completed successfully " });
  } else {
    // Handle failed payment (e.g., display error message)
    return res.status(400).json({ error: "Payment failed" });
  }
};

const updateOrderStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findOne({ _id: id });
  if (!order) {
    throw new ErrorResponse(
      `No order found with id: ${id}`,
      StatusCodes.NOT_FOUND
    );
  }

  checkPermissions(req.user, order.user);

  if (
    status === "shipped" ||
    status === "delivered" ||
    status === "return" ||
    status === "reviewed"
  ) {
    order.status = status;
  }

  order.save();

  return res.status(StatusCodes.OK).json({ order });
};

const fetchDailySalesData = async (req, res, next) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  try {
    // Create an array to store sales data for each hour in the day
    const salesDataByHour = [];

    // Loop through each hour of the day (from 0 to 23)
    for (let hour = 0; hour < 24; hour++) {
      // Calculate the start and end dates for the current hour
      const hourStartDate = new Date(
        currentYear,
        currentMonth,
        currentDay,
        hour,
        0,
        0
      );
      const hourEndDate = new Date(
        currentYear,
        currentMonth,
        currentDay,
        hour,
        59,
        59,
        999
      );

      // Aggregate sales within the current hour, grouped by hour of the day
      const hourlySales = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: hourStartDate, $lte: hourEndDate },
          },
        },
        {
          $group: {
            _id: { $hour: "$createdAt" },
            totalSales: { $sum: "$total" },
          },
        },
      ]);

      // Get the total sales for the current hour or set it to 0 if no data is available
      const totalSales =
        hourlySales.find((sale) => sale._id === hour)?.totalSales || 0;

      // Add the sales data for the current hour to the salesDataByHour array
      salesDataByHour.push({
        hour,
        totalSales,
      });
    }

    res.status(StatusCodes.OK).json({ salesDataByHour });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Unable to fetch orders." });
  }
};

const fetchWeeklySalesData = async (req, res, next) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDayOfWeek = currentDate.getDay(); // Sunday is 0, Monday is 1, and so on.

  try {
    // Array to store the day names
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Create an array to store sales data for each day in the week
    const salesDataByWeek = [];

    // Loop through each day of the week (Sunday to Saturday)
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      // Calculate the start and end dates for the current day
      const dayStartDate = new Date(
        currentYear,
        currentMonth,
        currentDate.getDate() - currentDayOfWeek + dayIndex
      );
      const dayEndDate = new Date(dayStartDate);
      dayEndDate.setHours(23, 59, 59, 999);

      // Aggregate sales within the current day, grouped by day of the week
      const dailySales = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: dayStartDate, $lte: dayEndDate },
          },
        },
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" },
            totalSales: { $sum: "$total" },
          },
        },
      ]);

      // Get the total sales for the current day or set it to 0 if no data is available
      const totalSales =
        dailySales.find((sale) => sale._id === dayIndex + 1)?.totalSales || 0;

      // Add the sales data for the current day to the salesDataByWeek array
      salesDataByWeek.push({
        dayName: dayNames[dayIndex],
        totalSales,
      });
    }

    res.status(StatusCodes.OK).json({ salesDataByWeek, dayNames });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Unable to fetch orders." });
  }
};

const fetchMonthlySalesData = async (req, res, next) => {
  const currentYear = new Date().getFullYear();

  try {
    // Create an array to store the sales data for all 12 months
    const salesDataByMonth = [];

    for (let month = 0; month < 12; month++) {
      // Calculate the start and end dates for each month
      const monthStartDate = new Date(currentYear, month, 1);
      const monthEndDate = new Date(currentYear, month + 1, 0, 23, 59, 59);

      // Aggregate sales within each month, grouped by month
      const monthlySales = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: monthStartDate, $lte: monthEndDate },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            totalSales: { $sum: "$total" },
          },
        },
      ]);

      // Get the total sales for the current month or set it to 0 if no data is available
      const totalSales =
        monthlySales.length > 0 ? monthlySales[0].totalSales : 0;

      // Add the sales data for the current month to the salesDataByMonth array
      salesDataByMonth.push({ month: month + 1, totalSales });
    }

    res.status(StatusCodes.OK).json({ salesDataByMonth });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Unable to fetch orders." });
  }
};

const fetchYearlySalesData = async (req, res, next) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const startYear = 2018; // Starting year

  try {
    const salesDataByYears = [];

    // Loop through each year from 2018 to the current year
    for (let year = startYear; year <= currentYear; year++) {
      // Calculate the start and end dates for the current year
      const yearStartDate = new Date(year, 0, 1);
      const yearEndDate = new Date(year, 11, 31, 23, 59, 59);

      // Aggregate sales within the current year, grouped by year
      const yearlySales = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: yearStartDate, $lte: yearEndDate },
          },
        },
        {
          $group: {
            _id: { $year: "$createdAt" },
            totalSales: { $sum: "$total" },
          },
        },
      ]);

      // Find the sales data for the current year in the aggregated result
      const salesDataForYear = yearlySales.find((sale) => sale._id === year);

      // Push the sales data for the current year to the array
      salesDataByYears.push({
        year,
        totalSales: salesDataForYear ? salesDataForYear.totalSales : 0,
      });
    }

    res.status(StatusCodes.OK).json({ salesDataByYears });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Unable to fetch orders." });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrder,
  updateOrderStatus,
  compareOrdersMonthly,
  fetchDailySalesData,
  fetchWeeklySalesData,
  fetchMonthlySalesData,
  fetchYearlySalesData,
};
