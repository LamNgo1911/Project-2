import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  products: [],
  product: {},
  users: [],
  deals: [],
  coupons: [],
  reviews: [],
  search: null,
  searchAdmin: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // user
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    // cate
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    removeCategory: (state, action) => {
      state.categories?.filter((category) => category._id !== action.payload);
    },
    // product
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    // deal
    setDeals: (state, action) => {
      state.deals = action.payload;
    },
    // coupon
    setCoupons: (state, action) => {
      state.coupons = action.payload;
    },
    removeCoupon: (state, action) => {
      state.coupons?.filter((coupon) => coupon._id !== action.payload);
    },
    // review
    setReviews: (state, action) => {
      state.reviews = action.payload;
    },
    setSearchRedux: (state, action) => {
      state.search = action.payload;
    },
    setSearchAdmin: (state, action) => {
      state.searchAdmin = action.payload;
    },
  },
});

export const {
  setUsers,
  setCategories,
  removeCategory,
  setProducts,
  setProduct,
  setDeals,
  setCoupons,
  removeCoupon,
  setReviews,
  setSearchRedux,
  setSearchAdmin,
} = authSlice.actions;

export default authSlice.reducer;
