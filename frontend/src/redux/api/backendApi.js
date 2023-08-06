import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const backendApi = createApi({
  reducerPath: "backendApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://wearmeout.onrender.com/api/v1",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    // category
    getAllCategories: builder.query({ query: () => `/categories` }),
    updateCategory: builder.query({
      query: (categoryId) => `/categories/${categoryId}/update`,
    }),
    getSingleCategoryProducts: builder.query({
      query: (id) => `/categories/${id}/products`,
    }),
    // product
    getAllProductsPerPage: builder.query({
      query: ({
        page = 1,
        limit = 0,
        sort = "",
        category = "",
        priceOption = "",
        lowestPrice = "",
        highestPrice = "",
        size = "",
        color = "",
        search = "",
      }) => {
        const queryParams = {
          page,
          limit,
          sort,
          category,
          priceOption,
          lowestPrice,
          highestPrice,
          size,
          color,
          search,
        };

        const queryString = Object.entries(queryParams)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join("&");

        return `/products?${queryString}`;
      },
    }),
    getTopProducts: builder.query({
      query: () => `/products?page=1&limit=8`,
    }),
    getWeeklyProducts: builder.query({
      query: () => `/products?sort=name`,
    }),
    getSingleProduct: builder.query({
      query: (id) => `/products/${id}`,
    }),
    // order
    getAllOrders: builder.query({
      query: ({ page = 1, limit = 0, search = "", status = "" }) => {
        const queryParams = {
          page,
          limit,
          search,
          status,
        };

        const queryString = Object.entries(queryParams)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join("&");

        return `/orders?${queryString}`;
      },
    }),
    getSingleOrder: builder.query({ query: (id) => `/orders/${id}` }),
    getCurrentUserOrders: builder.query({
      query: ({ category }) => `/orders/showAllMyOrders?category=${category}`,
    }),
    getCompareOrdersMonthly: builder.query({
      query: () => `/orders/compareOrdersMonthly`,
    }),
    getFetchDailySalesData: builder.query({
      query: () => `/orders/fetchDailySalesData`,
    }),
    getFetchWeeklySalesData: builder.query({
      query: () => `/orders/fetchWeeklySalesData`,
    }),
    getFetchMonthlySalesData: builder.query({
      query: () => `/orders/fetchMonthlySalesData`,
    }),
    getFetchYearlySalesData: builder.query({
      query: () => `/orders/fetchYearlySalesData`,
    }),
    // review
    getAllReviews: builder.query({ query: () => `/reviews` }),
    getSingleProductReviews: builder.query({
      query: ({ productId, page = 0, limit = 0 }) =>
        `/products/${productId}/reviews?page=${page}&limit=${limit}`,
    }),
    // user
    getAllUsers: builder.query({
      query: ({ page = 0, limit = 0, filter = "", search = "" }) => {
        return `/users?page=${page}&limit=${limit}&filter=${filter}&search=${search}`;
      },
    }),
    getCompareMonthlyUsers: builder.query({
      query: () => `/users/compareMonthlyUsers`,
    }),
    // coupon
    getAllCoupons: builder.query({
      query: ({ page = 0, limit = 0, search = "" }) =>
        `/coupons?page=${page}&limit=${limit}&search=${search}`,
    }),
    // deal
    getAllDeals: builder.query({
      query: ({ page = 0, limit = 0, search = "" }) =>
        `/deals?page=${page}&limit=${limit}&search=${search}`,
    }),
    // contact
    getContact: builder.query({ query: () => `/contact` }),
  }),
});

export const {
  // cate
  useGetAllCategoriesQuery,
  useUpdateCategoryQuery,
  useGetSingleCategoryProductsQuery,
  // product
  useGetAllProductsPerPageQuery,
  useGetSingleProductQuery,
  useGetTopProductsQuery,
  useGetWeeklyProductsQuery,
  // order
  useGetAllOrdersQuery,
  useGetSingleOrderQuery,
  useGetCurrentUserOrdersQuery,
  useGetCompareOrdersMonthlyQuery,
  useGetFetchDailySalesDataQuery,
  useGetFetchWeeklySalesDataQuery,
  useGetFetchMonthlySalesDataQuery,
  useGetFetchYearlySalesDataQuery,
  // review
  useGetAllReviewsQuery,
  useGetSingleProductReviewsQuery,
  // coupon
  useGetAllCouponsQuery,
  // user
  useGetAllUsersQuery,
  useGetCompareMonthlyUsersQuery,
  // deal
  useGetAllDealsQuery,
  // contact
  useGetContactQuery,
} = backendApi;
