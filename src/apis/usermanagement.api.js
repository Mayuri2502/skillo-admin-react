import { API_ENDPOINTS } from "../constants/api";
import axiosInstance from "../lib/Axios";

export const getUsers = async (params) => {
  try {
    const response = await axiosInstance.get(
      API_ENDPOINTS.USER_MANAGEMENT.GET_USERS,
      { params },
    );
    return response?.data.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const getUserById = async (params, id) => {
  try {
    const response = await axiosInstance.get(
      API_ENDPOINTS.USER_MANAGEMENT.GET_USER_ID + `/${id}`,
      { params },
    );
    return response?.data?.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const banUser = async (id,payload) => {
  try {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.USER_MANAGEMENT.BAN_USER+`/${id}`,
      payload ,
    );
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};
