import axios from "axios";


const Vite_BASE_URL = import.meta.env.VITE_BASE_URL;


export const apiRequest = axios.create({
  baseURL: Vite_BASE_URL,
  withCredentials: true,
});