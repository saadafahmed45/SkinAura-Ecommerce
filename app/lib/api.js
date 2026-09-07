import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Return custom error message if provided by backend
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected network error occurred.";
    return Promise.reject({ ...error, customMessage: message });
  }
);

export default api;
