import { categories as fallbackCategories } from "../../api/categories.js";
import { getApiBaseURL } from "../api.js";

const getApiBase = () => {
  return process.env.INTERNAL_API_URL || getApiBaseURL();
};

/**
 * Normalizes category object to ensure id and slug are present
 */
export const normalizeCategory = (cat) => {
  if (!cat) return null;
  const id = cat._id || cat.id || cat.legacyId;
  const slug =
    cat.slug ||
    cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
    "collection";
  return {
    ...cat,
    id,
    _id: cat._id || id,
    slug,
  };
};

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
 * Fetch all categories with Next.js Data Caching (revalidate: 3600s, tag: "categories")
 */
export async function getCategories() {
  const primaryBase = await resolveApiBase();
  const url = `${primaryBase}/categories`;

  try {
    const res = await fetch(url, {
      next: {
        revalidate: 3600,
        tags: ["categories"],
      },
    });

    if (res.ok) {
      const data = await res.json();
      const list = data.categories || data.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map(normalizeCategory);
      }
    }
  } catch {
    // Fallback to local categories
  }

  return fallbackCategories.map(normalizeCategory);
}

/**
 * Fetch single category by ID, slug, or name
 */
export async function getCategoryByIdOrSlug(idOrSlug) {
  if (!idOrSlug) return null;
  const cleanId = String(idOrSlug).trim();

  const primaryBase = await resolveApiBase();
  const url = `${primaryBase}/categories/${encodeURIComponent(cleanId)}`;

  try {
    const res = await fetch(url, {
      next: {
        revalidate: 3600,
        tags: ["categories", `category-${cleanId}`],
      },
    });

    if (res.ok) {
      const data = await res.json();
      const cat = data.category || data.data;
      if (cat) return normalizeCategory(cat);
    }
  } catch {
    // Fallback to local category
  }

  const fallback = fallbackCategories.find(
    (c) =>
      String(c.id) === cleanId ||
      c.name?.toLowerCase() === cleanId.toLowerCase() ||
      c.slug?.toLowerCase() === cleanId.toLowerCase()
  );

  return fallback ? normalizeCategory(fallback) : null;
}
