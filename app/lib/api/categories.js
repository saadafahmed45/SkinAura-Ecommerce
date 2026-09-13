import { categories as fallbackCategories } from "../../api/categories.js";

const getApiBase = () => {
  return (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api"
  );
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

/**
 * Fetch all categories with Next.js Data Caching (revalidate: 3600s, tag: "categories")
 */
export async function getCategories() {
  const url = `${getApiBase()}/categories`;

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
  } catch (err) {
    console.warn("[getCategories] Server fetch error, using fallback:", err?.message);
  }

  return fallbackCategories.map(normalizeCategory);
}

/**
 * Fetch single category by ID, slug, or name
 */
export async function getCategoryByIdOrSlug(idOrSlug) {
  if (!idOrSlug) return null;
  const cleanId = String(idOrSlug).trim();

  const url = `${getApiBase()}/categories/${encodeURIComponent(cleanId)}`;

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
  } catch (err) {
    console.warn(`[getCategoryByIdOrSlug] Fetch failed for ${cleanId}:`, err?.message);
  }

  const fallback = fallbackCategories.find(
    (c) =>
      String(c.id) === cleanId ||
      c.name?.toLowerCase() === cleanId.toLowerCase() ||
      c.slug?.toLowerCase() === cleanId.toLowerCase()
  );

  return fallback ? normalizeCategory(fallback) : null;
}
