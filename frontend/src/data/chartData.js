const chartData = {
  datasets: {
    yearlySales: {
      label: "Yearly Sales",
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      categories: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
      backgroundColor: "#93ebc2",
    },
    monthlySales: {
      label: "Monthly Sales",
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 80, 100, 120],
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      backgroundColor: "#85e6f9",
    },
    weeklySales: {
      label: "Weekly Sales",
      data: [10, 41, 35, 49, 62, 91, 69],
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      backgroundColor: "#e87d88",
    },
    dailySales: {
      label: "Daily Sales",
      data: [
        10, 41, 35, 51, 49, 62, 69, 91, 148, 120, 100, 80, 60, 40, 20, 10, 5, 2,
        1, 0, 22, 80, 60, 10,
      ],
      categories: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24,
      ],
      backgroundColor: "#e87d88",
    },
  },
};

export default chartData;
