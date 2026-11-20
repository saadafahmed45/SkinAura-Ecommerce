import { fallbackSlides, normalizeBanner } from "../../api/heroSlides.js";
import { getApiBaseURL } from "../api.js";

export { fallbackSlides, normalizeBanner };

let isLocalBackendAvailable = null;
let lastCheckTime = 0;

const checkLocalBackend = async () => {
  if (typeof window !== "undefined") return true;
  const now = Date.now();
  if (isLocalBackendAvailable !== null && now - lastCheckTime < 15000) {
    return isLocalBackendAvailable;
  }

  return new Promise((resolve) => {
    try {
      const net = require("net");
      const socket = net.createConnection({ port: 5000, host: "127.0.0.1" });
      socket.setTimeout(80);
      socket.on("connect", () => {
        socket.destroy();
        isLocalBackendAvailable = true;
        lastCheckTime = Date.now();
        resolve(true);
      });
      socket.on("error", () => {
        socket.destroy();
        isLocalBackendAvailable = false;
        lastCheckTime = Date.now();
        resolve(false);
      });
      socket.on("timeout", () => {
        socket.destroy();
        isLocalBackendAvailable = false;
        lastCheckTime = Date.now();
        resolve(false);
      });
    } catch {
      resolve(false);
    }
  });
};

const resolveApiBase = async () => {
  const base = process.env.INTERNAL_API_URL || getApiBaseURL();
  if (base.includes("localhost") || base.includes("127.0.0.1")) {
    const isLive = await checkLocalBackend();
    if (!isLive) {
      return "https://skin-aura-server.vercel.app/api";
    }
  }
  return base;
};

/**
 * Fetch all active hero banner slides with Next.js Data Caching
 */
export async function getBanners() {
  const primaryBase = await resolveApiBase();
  const url = `${primaryBase}/banners`;

  try {
    const res = await fetch(url, {
      next: {
        revalidate: 300,
        tags: ["banners"],
      },
    });

    if (res.ok) {
      const data = await res.json();
      const list = data.banners || data.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map(normalizeBanner);
      }
    }
  } catch (err) {
    console.warn("[getBanners] Falling back to default slides:", err?.message);
  }

  return fallbackSlides.map(normalizeBanner);
}
