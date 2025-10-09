import axios from "axios";
import { store } from "../redux/store"; 
import { logout } from "../redux/userSlice";
import { toast } from "../redux/useToast";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export const apiRequest = axios.create({
  baseURL: VITE_BASE_URL,
  withCredentials: true,
});





// 🚫 Endpoints to ignore refresh retry
const authEndpoints = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/refresh",
  "/auth/logout",
];

apiRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ⛔ If no response or already retried, just reject
    if (!error.response || originalRequest._retry) {
      return Promise.reject(error);
    }

    const isAuthRoute = authEndpoints.some((endpoint) =>
      originalRequest.url.includes(endpoint)
    );

    // ✅ Only refresh if not an auth route
    if (error.response.status === 401 && !isAuthRoute) {
      originalRequest._retry = true;
      try {
        await apiRequest.post("/auth/refresh");
        return apiRequest(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please log in again.",
        });
      }
    }

    // ❌ 403 - Forbidden
    if (error.response.status === 403) {
      store.dispatch(logout());
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Please log in again.",
      });
    }

    return Promise.reject(error);
  }
);
