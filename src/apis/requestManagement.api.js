import { API_ENDPOINTS } from "../constants/api";
import axiosInstance from "../lib/Axios";

export const getRequestList = async (params) => {
  try {
    const response = await axiosInstance.get(
      API_ENDPOINTS.REQUEST_MANAGEMENT.REQUEST_LIST,
      { params },
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data || "Something went wrong";
  }
};

export const getRequestDetail = async (id) => {
  try {
    const response = await axiosInstance.get(
      API_ENDPOINTS.REQUEST_MANAGEMENT.GET_REQUEST + `/${id}`,
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data || "Something went wrong";
  }
};
