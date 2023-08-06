// create store
import { configureStore } from "@reduxjs/toolkit";
import shoppingReducer from "./service/shoppingSlice";
import { backendApi } from "./api/backendApi";
import authReducer from "./service/authSlice";
import infoReducer from "./service/infoSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    info: infoReducer,
    shopping: shoppingReducer,
    [backendApi.reducerPath]: backendApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(backendApi.middleware),
});

export default store;
