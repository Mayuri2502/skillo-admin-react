import { API_ENDPOINTS } from "../constants/api";
import axiosInstance from "../lib/Axios";

export const getPayment = async (params) => {
  try {
    const response = await axiosInstance.get(
      API_ENDPOINTS.PAYMENT.PAYMENT_LIST,
      params,
    );
    return response;
  } catch (error) {
    return error?.response?.data;
  }
};
