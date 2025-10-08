import axios from "axios";
import { store } from "../redux/store"; 
import { logout } from "../redux/userSlice";
import { toast } from "../redux/useToast"; // 

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export const apiRequest = axios.create({
  baseURL: VITE_BASE_URL,
  withCredentials: true,
});

apiRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await apiRequest.post('/auth/refresh');
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
    
    if (error.response?.status === 403) {
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