import axios from "axios";
import { toast } from "sonner";

export const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const apiClient = axios.create({
  baseURL: SERVER_URL,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || "An error occurred";
    toast.error("System Error", {
      description: errorMessage,
      duration: 5000,
    });
    return Promise.reject(error);
  },
);
