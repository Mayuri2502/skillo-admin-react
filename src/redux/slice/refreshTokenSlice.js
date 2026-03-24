import { createAsyncThunk } from "@reduxjs/toolkit";

export const refreshToken = createAsyncThunk(
  "/userService/auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const refresh_token = localStorage.getItem("_dw_art");
      const { data } = await authServices.refresh({ refresh_token });

      return {
        accessToken: data.access_token,
        user: data.user_data,
      };
    } catch (err) {
      return rejectWithValue("Session expired");
    }
  }
);
