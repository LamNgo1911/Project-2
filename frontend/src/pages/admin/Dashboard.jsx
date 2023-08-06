import React, { useEffect, useState } from "react";
import Card from "../../components/admin/Card";
import Chart from "react-apexcharts";

import {
  useGetAllOrdersQuery,
  useGetCompareMonthlyUsersQuery,
  useGetCompareOrdersMonthlyQuery,
  useGetFetchDailySalesDataQuery,
  useGetFetchMonthlySalesDataQuery,
  useGetFetchWeeklySalesDataQuery,
  useGetFetchYearlySalesDataQuery,
} from "../../redux/api/backendApi";

function getStatusClass(orderStatus) {
  switch (orderStatus) {
    case "delivered":
    case "paid":
      return "bg-[#d1e7dd]";
    case "pending":
      return "bg-[#fffcb3]";
    default:
      return "bg-[#e1a9ae]";
  }
}

const TableCard = ({
  number,
  orderID,
  orderDate,
  orderStatus,
  orderTotal,
  email,
  customer,
}) => {
  const date = new Date(orderDate);

  // Function to pad single-digit numbers with leading zeroes
  const padZero = (num) => (num < 10 ? "0" + num : num);

  // Get the day, month, and year from the Date object
  const day = padZero(date.getDate());
  const month = padZero(date.getMonth() + 1); // Adding 1 since getMonth() returns 0-11
  const year = date.getFullYear();

  // Construct the "dd/mm/yyyy" formatted date string
  const formattedDate = `${day}/${month}/${year}`;

  return (
    <tbody>
      <tr>
        <td className="font-normal text-xs md:text-sm">{number + 1}</td>
        <td className="font-normal text-xs md:text-sm">{orderID}</td>
        <td className="font-normal text-xs md:text-sm">{customer}</td>
        <td className="font-normal text-xs md:text-sm">{email}</td>
        <td className="font-normal text-xs md:text-sm">{formattedDate}</td>
        <td className={`font-normal text-xs md:text-sm`}>
          <p className={`rounded-lg p-2 ${getStatusClass(orderStatus)}`}>
            {orderStatus}
          </p>
        </td>
        <td className="font-normal text-xs md:text-sm">{orderTotal}$</td>
      </tr>
    </tbody>
  );
};

function Dashboard() {
  const [time, setTime] = useState("");
  const [tableData, setTableData] = useState([]);
  const { data: allOrderData } = useGetAllOrdersQuery({});
  const { data: orderData } = useGetCompareOrdersMonthlyQuery();
  const { data: userData } = useGetCompareMonthlyUsersQuery();
  const { data: dailySalesData } = useGetFetchDailySalesDataQuery();
  const { data: weeklySalesData } = useGetFetchWeeklySalesDataQuery();
  const { data: monthlySalesData } = useGetFetchMonthlySalesDataQuery();
  const { data: yearlySalesData } = useGetFetchYearlySalesDataQuery();

  useEffect(() => {
    setTableData(allOrderData?.orders?.slice(0, 4));
  }, [allOrderData]);

  // console.log(userData);

  const currentMonthTotalSales =
    orderData?.currentMonthOrders?.reduce((total, order) => {
      return total + order?.total;
    }, 0) || 0;

  const lastMonthTotalSales =
    orderData?.lastMonthOrders?.reduce((total, order) => {
      return total + order?.total;
    }, 0) || 0;

  const totalSalesDifference =
    ((currentMonthTotalSales - lastMonthTotalSales) /
      (currentMonthTotalSales + lastMonthTotalSales)) *
      100 || 0;

  const currentMonthOrdersAmount = orderData?.currentMonthOrders?.length;
  const lastMonthOrdersAmount = orderData?.lastMonthOrders?.length;

  const ordersAmountDifference =
    ((currentMonthOrdersAmount - lastMonthOrdersAmount) /
      (currentMonthOrdersAmount + lastMonthOrdersAmount)) *
      100 || 0;

  const currentMonthUsersAmount = userData?.currentMonthUsers?.length;
  const lastMonthUsersAmount = userData?.lastMonthUsers?.length;

  const usersAmountDifference =
    ((currentMonthUsersAmount - lastMonthUsersAmount) /
      (currentMonthUsersAmount + lastMonthUsersAmount)) *
      100 || 0;

  const cardsData = [
    {
      title: "Total sales",
      barValue: totalSalesDifference,
      value: currentMonthTotalSales,
      backgroundColor: "#93ebc2",
    },
    {
      title: "Total orders",
      barValue: ordersAmountDifference,
      value: currentMonthOrdersAmount,
      backgroundColor: "#85e6f9",
    },
    {
      title: "Total users",
      barValue: usersAmountDifference,
      value: currentMonthUsersAmount,
      backgroundColor: "#e87d88",
    },
  ];

  let series = [
    {
      name: "Yearly sales",
      data: yearlySalesData?.salesDataByYears?.map((data) => data.totalSales),
    },
  ];

  let options = {
    chart: {
      id: "apexchart-revenue",
    },
    xaxis: {
      categories: yearlySalesData?.salesDataByYears.map((data) => data.year),
      align: "bottom",
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
      },
      labels: {
        show: true,
      },
      title: {
        text: "Year(s)",
      },
    },
    yaxis: {
      show: true,
      showAlways: true,
      align: "left",
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
      },
      labels: {
        show: true,
      },
      title: {
        text: "Total Revenue($)",
      },
      tooltip: {
        enabled: true,
      },
    },
    stroke: {
      curve: "smooth",
    },
    colors: ["#5d3791"],
    dropShadow: {
      enabled: true,
      color: "#000",
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2,
    },
    fill: {
      colors: ["#5d3791"],
      type: "gradient",
    },
    text: {
      style: {
        colors: ["#5d3791"],
        fontSize: "12px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: 400,
        cssClass: "apexcharts-xaxis-label",
      },
    },
  };
  console.log(monthlySalesData);
  // console.log(yearlySalesData);
  if (time === "monthly") {
    const categories = monthlySalesData?.salesDataByMonth.map(
      (data) => data.month
    );
    const data = monthlySalesData?.salesDataByMonth?.map(
      (data) => data.totalSales
    );
    series = [
      {
        name: "Monthly sales",
        data,
      },
    ];
    options.xaxis.categories = categories;
    options.xaxis.title.text = "Month(s)";
  } else if (time === "weekly") {
    console.log(weeklySalesData);
    const categories = weeklySalesData?.dayNames?.map((dayname) => {
      return dayname;
    });
    const data = weeklySalesData?.salesDataByWeek?.map(
      (data) => data.totalSales
    );
    series = [
      {
        name: "Weekly sales",
        data,
      },
    ];
    options.xaxis.categories = categories;
    options.xaxis.title.text = "Day(s)";
  } else if (time === "daily") {
    const categories = dailySalesData?.salesDataByHour.map(
      (data) => `${data.hour}:00`
    );
    const data = dailySalesData?.salesDataByHour.map((data) => data.totalSales);

    series = [
      {
        name: "Daily Sales",
        data,
      },
    ];
    options.xaxis.categories = categories;
    options.xaxis.title.text = "Hour(s)";
  }

  return (
    <div className="pt-[10vh] md:pt-0 px-8 pb-8">
      <div className="flex flex-col gap-8 pt-8">
        <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 w-full gap-4">
          {cardsData?.map((card, id) => (
            <Card
              key={id}
              title={card?.title}
              barValue={card?.barValue}
              value={card?.value}
              series={card?.series}
              id={id}
              backgroundColor={card?.backgroundColor}
            />
          ))}
        </div>

        <div className="w-full border rounded-lg lg:col-span-2 p-4 flex flex-col gap-8 bg-[#fff]">
          <div className="flex justify-between items-center text-xs md:text-sm font-bold">
            <h1 className="font-bold text-base md:text-lg">Revenue</h1>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-[#fff] outline-none border-none"
            >
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
          </div>
          <Chart series={series} type="line" options={options} />
        </div>
        {/* latest orders */}
        <div className="overflow-x-scroll justify-center w-full border rounded-lg">
          <table>
            <thead>
              <tr className="border bg-[#c7b5e3]">
                <th>No.</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Payment</th>
                <th>Order Date</th>
                <th>Order Status</th>
                <th>Order Total</th>
              </tr>
            </thead>
            {tableData?.map((order, index) => (
              <TableCard
                key={index}
                number={index}
                orderID={order?._id}
                customer={order?.shippingInfo?.name}
                email={order?.shippingInfo?.email}
                orderDate={order?.createdAt}
                orderStatus={order?.status}
                orderTotal={order?.total}
              />
            ))}
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
