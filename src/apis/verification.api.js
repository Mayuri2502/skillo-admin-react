import { API_ENDPOINTS } from "../constants/api";
import axiosInstance from "../lib/Axios";

export const getVerifyDetail = async (params) => {
  try {
    const response = await axiosInstance.get(
      API_ENDPOINTS.VERIFICATION.GET_VERIFICATION_DETAIL,
       params ,
    );
    return response;
  } catch (error) {
    return error?.response?.data;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(
      API_ENDPOINTS.VERIFICATION.GET_USER_DETAIL + `/${id}`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const verifyDoc = async (id) => {
  try {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.VERIFICATION.VERIFY_DOC + `/${id}`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const rejectDoc = async (id) => {
  try {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.VERIFICATION.REJECT_DOC + `/${id}`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
