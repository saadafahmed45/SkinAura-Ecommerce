import { skincareProducts } from "../../api/skinData.js";

const getApiBase = () => {
  return (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api"
  );
};

/**
 * Normalizes product object to ensure consistent id, price, and images
 */
export const normalizeProduct = (p) => {
  if (!p) return null;
  const id = p._id || p.id || p.legacyId;
  const images =
    Array.isArray(p.images) && p.images.length > 0
      ? p.images
      : [
          p.image ||
            "https://images.pexels.com/photos/3762756/pexels-photo-3762756.jpeg",
        ];
  return {
    ...p,
    id,
    _id: p._id || id,
    images,
  };
};

/**
 * Filter fallback data offline / when API is unreachable
 */
const filterFallbackProducts = (params = {}) => {
  let list = [...skincareProducts];
  const {
    category,
    sort,
    minPrice,
    maxPrice,
    rating,
    search,
    isFeatured,
    isTopSelling,
    page = 1,
    limit = 20,
  } = params;

  if (category && category !== "all") {
    list = list.filter(
      (p) => p.category?.toLowerCase() === category.toLowerCase()
    );
  }
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }
  if (minPrice !== undefined && minPrice !== "" && Number(minPrice) > 0) {
    list = list.filter((p) => (p.price || 0) >= Number(minPrice));
  }
  if (maxPrice !== undefined && maxPrice !== "" && Number(maxPrice) > 0) {
    list = list.filter((p) => (p.price || 0) <= Number(maxPrice));
  }
  if (rating !== undefined && Number(rating) > 0) {
    list = list.filter((p) => (p.rating || 0) >= Number(rating));
  }
  if (isFeatured !== undefined) {
    const feat = isFeatured === "true" || isFeatured === true;
    list = list.filter((p) => Boolean(p.isFeatured) === feat);
  }
  if (isTopSelling !== undefined) {
    const top = isTopSelling === "true" || isTopSelling === true;
    list = list.filter((p) => Boolean(p.isTopSelling) === top);
  }

  if (sort === "price-low") {
    list.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sort === "price-high") {
    list.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sort === "rating") {
    list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sort === "top-selling" || sort === "sold") {
    list.sort((a, b) => {
      if (Boolean(b.isTopSelling) !== Boolean(a.isTopSelling)) {
        return b.isTopSelling ? 1 : -1;
      }
      return (b.sold || 0) - (a.sold || 0) || (b.rating || 0) - (a.rating || 0);
    });
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const total = list.length;
  const paginated = list.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  return {
    products: paginated.map(normalizeProduct),
    total,
    totalPages: Math.ceil(total / limitNum) || 1,
    currentPage: pageNum,
  };
};

/**
 * Fetch products with Next.js App Router Data Caching (revalidate: 300s, tag: "products")
 */
export async function getProducts(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });

  const url = `${getApiBase()}/products${query.toString() ? `?${query.toString()}` : ""}`;

  try {
    const res = await fetch(url, {
      next: {
        revalidate: 300,
        tags: ["products"],
      },
    });

    if (!res.ok) {
      return filterFallbackProducts(params);
    }

    const data = await res.json();
    const rawList = data.products || data.data || [];
    return {
      products: rawList.map(normalizeProduct),
      total: data.total || rawList.length,
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || 1,
    };
  } catch (err) {
    console.warn("[getProducts] Server fetch error, using fallback:", err?.message);
    return filterFallbackProducts(params);
  }
}

/**
 * Fetch a single product by ID, slug, or legacyId with tag: `product-${idOrSlug}`
 */
export async function getProductByIdOrSlug(idOrSlug) {
  if (!idOrSlug) return null;
  const cleanId = String(idOrSlug).trim();

  const url = `${getApiBase()}/products/${encodeURIComponent(cleanId)}`;

  try {
    const res = await fetch(url, {
      next: {
        revalidate: 300,
        tags: ["products", `product-${cleanId}`],
      },
    });

    if (res.ok) {
      const data = await res.json();
      const product = data.product || data.data;
      if (product) {
        return normalizeProduct(product);
      }
    }
  } catch (err) {
    console.warn(`[getProductByIdOrSlug] Fetch failed for ${cleanId}:`, err?.message);
  }

  // Fallback to local skincareProducts
  const fallback = skincareProducts.find(
    (p) =>
      String(p.id) === cleanId ||
      String(p._id) === cleanId ||
      p.slug?.toLowerCase() === cleanId.toLowerCase()
  );

  return fallback ? normalizeProduct(fallback) : null;
}

/**
 * Fetch Top Selling Products for Homepage or Curated carousel
 */
export async function getTopSellingProducts(limit = 8) {
  const result = await getProducts({
    sort: "top-selling",
    limit,
  });
  return result.products;
}

/**
 * Fetch Featured Products by Category for Homepage sections
 */
export async function getFeaturedProducts(categoryName, limit = 4) {
  const result = await getProducts({
    category: categoryName,
    limit,
  });
  return result.products;
}

/**
 * Fetch Related Products for Product Detail Page
 */
export async function getRelatedProducts(category, currentProductId, limit = 4) {
  if (!category) return [];

  const result = await getProducts({
    category,
    limit: limit + 2,
  });

  return result.products
    .filter((p) => String(p.id) !== String(currentProductId) && String(p._id) !== String(currentProductId))
    .slice(0, limit);
}
