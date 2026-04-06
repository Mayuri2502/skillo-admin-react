import axiosInstance from "../lib/Axios.js";

const login = async (credentials) => {
  const { data } = await axiosInstance.post(
    "/admin/auth/login",
    credentials
  );
  return data;
};

const logout = async () => {
  const refreshToken = localStorage.getItem("_dw_art");

  if (refreshToken) {
    await axiosInstance.post("/admin/auth/logout", {
      refresh_token: refreshToken,
    });
  }
};

export default {
  login,
  logout,
};
