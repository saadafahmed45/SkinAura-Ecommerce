import axios from "axios";

// Determine appropriate base URL depending on environment
export const getApiBaseURL = () => {
  // 1. Explicitly configured environment variable
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl;
  }

  // 2. In browser environment
  if (typeof window !== "undefined") {
    const { hostname, protocol } = window.location;

    // Localhost development
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return envUrl || "http://localhost:5000/api";
    }

    // Local LAN testing on HTTP (e.g. 192.168.x.x, 10.x.x.x)
    const isLocalNetwork =
      /^192\.168\./.test(hostname) ||
      /^10\./.test(hostname) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname);

    if (isLocalNetwork && protocol === "http:") {
      return `http://${hostname}:5000/api`;
    }

    // Production / Vercel deployment (e.g., skin-aura-shop.vercel.app)
    return "https://skin-aura-server.vercel.app/api";
  }

  // 3. Server-side rendering fallback
  if (process.env.NODE_ENV === "production") {
    return "https://skin-aura-server.vercel.app/api";
  }

  return envUrl || "http://localhost:5000/api";
};

const api = axios.create({
  baseURL: getApiBaseURL(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("skinaura_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected network error occurred.";
    return Promise.reject({ ...error, customMessage: message });
  }
);

export default api;

