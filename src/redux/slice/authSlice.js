import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authServices from "../../services/authServices.js";

export const login = createAsyncThunk(
  "/userService/auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await authServices.login(credentials);
      return data;
    } catch (err) {
      return rejectWithValue({
        message:
          err?.response?.data?.message || "Login failed",
      });
    }
  },
);

export const logout = createAsyncThunk("/userService/auth/logout", async () => {
  const { data } = await authServices.logout();
  return data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isError: false,
    accessToken: null,
    isSuccess: false,
    message: "",
  },
  reducers: {
    // Reset auth state
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      state.user = null;
      state.isAuthenticated = false;
      // localStorage.removeItem("userData");
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },

    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // localStorage.removeItem("userData");
    },
    logoutHard: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      //  clear persistence
      localStorage.removeItem("_dw_aat");
      localStorage.removeItem("_dw_art");
      localStorage.removeItem("userData");
    },
  },
  extraReducers: (builder) => {
    builder
      /* Login */
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { user_data, access_token, refresh_token } = action.payload;

        state.isLoading = false;
        state.isSuccess = true;
        state.user = user_data;
        state.accessToken = access_token;
        state.isAuthenticated = true;

        // persist
        localStorage.setItem("_dw_aat", access_token);
        localStorage.setItem("_dw_art", refresh_token);
        localStorage.setItem("userData", JSON.stringify(user_data));
      })

      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })

      /* Logout */
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { reset, setUser, clearUser, setCredentials, logoutHard } =
  authSlice.actions;
export default authSlice.reducer;
