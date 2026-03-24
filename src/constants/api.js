const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const API_ENDPOINTS = {
  USER_MANAGEMENT: {
    GET_USERS: `${API_BASE_URL}admin/users`,
    GET_USER_ID: `${API_BASE_URL}admin/view-user`,
    BAN_USER: `${API_BASE_URL}admin/ban-user`,
  },
  VERIFICATION: {
    GET_VERIFICATION_DETAIL: `${API_BASE_URL}admin/pending-verification`,
    GET_USER_DETAIL: `${API_BASE_URL}admin/view-professional`,
    VERIFY_DOC: `${API_BASE_URL}admin/verify-document`,
    REJECT_DOC: `${API_BASE_URL}admin/reject-document`,
  },
  DASHBOARD: {
    OVERVIEW: `${API_BASE_URL}admin/overview`,
  },
  PROFILE: {
    UPDATE_PASS: `${API_BASE_URL}userService/auth/admin/change-password`,
  },
  REQUEST_MANAGEMENT: {
    REQUEST_LIST: `${API_BASE_URL}admin/request_management/lists`,
    GET_REQUEST: `${API_BASE_URL}admin/request_management/details`,
  },
  PAYMENT: {
    PAYMENT_LIST: `${API_BASE_URL}admin/payment/all_transactions`,
  },
};
