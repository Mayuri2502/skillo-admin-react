import axios from "axios";
import { logoutHard, setCredentials } from "../redux/slice/authSlice";

let reduxStore = null;

export const injectStore = (store) => {
  reduxStore = store;
};

let isRefreshing = false;
let queue = [];

const resolveQueue = (error, token = null) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  queue = [];
};

function forceLogout() {
  if (!reduxStore) return;

  reduxStore.dispatch(logoutHard());

  localStorage.removeItem("_dw_aat");
  localStorage.removeItem("_dw_art");
  localStorage.removeItem("userData");

  window.location.href = "/login";
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // ✅ Existing token functionality (unchanged)
    const token = localStorage.getItem("_dw_aat");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Add language header (NEW)
    const lang = localStorage.getItem("skillo-language") || "en";
    config.headers["Accept-Language"] = lang;
    config.params = config.params || {};
    config.params.lang = lang;

    return config;
  },
  
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status == 401 && original.url?.includes("/change-password")) {
      return Promise.reject(error);
    }

    if (
      error.code === "ERR_NETWORK" ||
      error.message === "Network Error" ||
      error.message?.includes("ERR_FAILED")
    ) {
      forceLogout();
      return Promise.reject(error);
    }

    if (!original) {
      forceLogout();
      return Promise.reject(error);
    }

    if (original.url?.includes("/auth/refresh")) {
      forceLogout();
      return Promise.reject(error);
    }

    // Since Skillo admin API doesn't have refresh endpoint, disable refresh logic
    // and directly logout on 401 errors
    if (error.response?.status === 401) {
      forceLogout();
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // Skip refresh logic for Skillo admin
    forceLogout();
    return Promise.reject(error);
  },
);

export default axiosInstance;
