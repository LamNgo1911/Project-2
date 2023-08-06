import { createSlice } from "@reduxjs/toolkit";

const localUser = JSON.parse(sessionStorage.getItem("user")) || {};
const localEmail = JSON.parse(sessionStorage.getItem("email")) || null;
const initialState = {
  otp: null,
  email: localEmail,
  user: localUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    getEmail: (state, action) => {
      state.email = action.payload;
      sessionStorage.setItem("email", JSON.stringify(state.email));
    },
    getUser: (state, action) => {
      state.user = action.payload;
      sessionStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { getEmail, getUser } = authSlice.actions;

export default authSlice.reducer;
