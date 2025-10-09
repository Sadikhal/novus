import axios from "axios";
import { store } from "../redux/store"; 
import { logout } from "../redux/userSlice";
import { toast } from "../redux/useToast";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export const apiRequest = axios.create({
  baseURL: VITE_BASE_URL,
  withCredentials: true,
});


