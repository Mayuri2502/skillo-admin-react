import axiosInstance from "../lib/Axios.js";

const forgotPassword = async (email) => {
  const { data } = await axiosInstance.post(
    "/userService/auth/reset/start",
    { email }
  );
  return data;
};

const verifyOtp = async (email, otp) => {
  const { data } = await axiosInstance.post(
    "/userService/auth/reset/verify",
    { email, otp }
  );
  return data;
};

const resetPassword = async (payload) => {
  const { data } = await axiosInstance.post(
    "/userService/auth/reset/confirm",
    payload
  );
  return data;
};

const login = async (credentials) => {
  const { data } = await axiosInstance.post(
    "/userService/auth/login",
    credentials
  );
  return data;
};

const logout = async () => {
  const refreshToken = localStorage.getItem("_dw_art");

  if (refreshToken) {
    await axiosInstance.post("/userService/auth/logout", {
      refresh_token: refreshToken,
    });
  }
};

export default {
  forgotPassword,
  verifyOtp,
  resetPassword,
  login,
  logout,
};
