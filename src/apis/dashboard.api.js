import { API_ENDPOINTS } from "../constants/api";
import axiosInstance from "../lib/Axios";

export const getadminDetail = async (params) => {
  try {
    const response = await axiosInstance.get(
      API_ENDPOINTS.DASHBOARD.OVERVIEW,
      { params },
    );
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};