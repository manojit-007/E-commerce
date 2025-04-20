import axios from "axios";
import { tokenManager } from "@/utils/tokenManager";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Initialize Axios Instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enable cookies for cross-origin requests
});

// Request Interceptor: Attach Authorization Header
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken(); // Get token from Token Manager
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Token Expiry or Unauthorized Errors
apiClient.interceptors.response.use(
  (response) => response, // Pass successful responses through
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized or Token Expired. Redirecting to login.");

      // Clear token via Token Manager
      tokenManager.clearToken();

      // Redirect to login page
      window.location.href = "/login";
    }

    // Handle other response errors
    return Promise.reject(error);
  }
);

export default apiClient;
