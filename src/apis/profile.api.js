import { API_ENDPOINTS } from "../constants/api";
import axiosInstance from "../lib/Axios";

export const changePassword = async (params) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.PROFILE.UPDATE_PASS,
      params,
    );
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};
