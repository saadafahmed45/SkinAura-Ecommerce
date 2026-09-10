import axios from "axios";

// Determine appropriate base URL depending on client environment
const getInitialBaseURL = () => {
  if (typeof window !== "undefined") {
    const { hostname } = window.location;
    const isRemoteDevice =
      hostname && hostname !== "localhost" && hostname !== "127.0.0.1";
    const envUrl = process.env.NEXT_PUBLIC_API_URL;

    // If an external production URL is explicitly configured (e.g. https://api.site.com/api)
    if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
      return envUrl;
    }

    // On mobile or remote device on LAN, use relative /api (proxied by Next.js to backend)
    if (isRemoteDevice) {
      return "/api";
    }

    return envUrl || "/api";
  }

  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
};

const api = axios.create({
  baseURL: getInitialBaseURL(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach token and redirect localhost URLs on mobile devices to relative /api
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const { hostname } = window.location;
    const isRemoteDevice =
      hostname && hostname !== "localhost" && hostname !== "127.0.0.1";

    // Prevent mobile devices from trying to connect to localhost:5000
    if (
      isRemoteDevice &&
      config.baseURL &&
      (config.baseURL.includes("localhost") || config.baseURL.includes("127.0.0.1"))
    ) {
      config.baseURL = "/api";
    }

    const token = localStorage.getItem("skinaura_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for handling errors globally with automatic fallback
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If request failed using relative /api on a remote/mobile device, attempt direct port 5000 fallback
    if (
      typeof window !== "undefined" &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.baseURL === "/api"
    ) {
      const { hostname } = window.location;
      if (hostname && hostname !== "localhost" && hostname !== "127.0.0.1") {
        originalRequest._retry = true;
        originalRequest.baseURL = `http://${hostname}:5000/api`;
        try {
          return await axios(originalRequest);
        } catch {
          // Fall through to reject
        }
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected network error occurred.";
    return Promise.reject({ ...error, customMessage: message });
  }
);

export default api;
