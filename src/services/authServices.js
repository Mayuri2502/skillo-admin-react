import axiosInstance from "../lib/Axios.js";

const login = async (credentials) => {
  const { data } = await axiosInstance.post(
    "/admin/auth/login",
    credentials
  );
  return data;
};

const logout = async (refreshToken) => {
  const { data } = await axiosInstance.post(
    "/admin/auth/logout",
    { refresh_token: refreshToken }
  );
  return data;
};

export default {
  login,
  logout,
};
