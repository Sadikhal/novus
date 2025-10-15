import axios from "axios";
import { store } from "../redux/store"; 
import { loginSuccess, logout } from "../redux/userSlice";
import { toast } from "../redux/useToast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const apiRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve();
  });
  failedQueue = [];
};

apiRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;

    const status = error.response?.status;
    const message = error.response?.data?.message;

    const isTokenExpired =
      (status === 403 &&
        (message === "Token expired" || 
         message === "Invalid token" || 
         (typeof message === "string" && message.toLowerCase().includes("token expired")) ||
         (typeof message === "string" && message.toLowerCase().includes("invalid token")))) ||
      (status === 401 && message === "Not authenticated");

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (!isTokenExpired) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => apiRequest(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });

      const returned = refreshResponse?.data;
      let newUser = null;

      if (returned?.user) {
        newUser = returned.user;
      } else if (returned && (returned._id || returned.email || returned.id)) {
        newUser = returned;
      } else {
        try {
          const profileRes = await axios.get(`${BASE_URL}/users/profile`, { withCredentials: true });
          if (profileRes?.data) newUser = profileRes.data;
        } catch (profileErr) {
          console.error("Failed to fetch profile after token refresh:", profileErr);
        }
      }

      if (newUser) {
        store.dispatch(loginSuccess(newUser));
      } else {
        toast({
          variant: "secondary",
          title: "Session refreshed",
          description: "Your session tokens were refreshed.",
        });
      }

      processQueue(null);
      isRefreshing = false;

      return apiRequest(originalRequest);
    } catch (refreshErr) {
      processQueue(refreshErr);
      isRefreshing = false;

      toast({
        variant: "destructive",
        title: "Session expired",
        description: "Please login again.",
      });

      try {
        store.dispatch(logout());
      } catch (e) {
        console.error("Error during logout after refresh failure:", e);
      }
      window.location.href = "/login";

      return Promise.reject(refreshErr);
    }
  }
);

export default apiRequest;