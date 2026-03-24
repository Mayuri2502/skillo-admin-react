import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice.js";
import { injectStore } from "../lib/Axios.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
injectStore(store);