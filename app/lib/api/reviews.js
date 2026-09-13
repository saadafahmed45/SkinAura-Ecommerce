const getApiBase = () => {
  return (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api"
  );
};

/**
 * Fetch approved reviews for a product with Next.js Data Caching (revalidate: 600s, tag: `reviews-${productId}`)
 */
export async function getProductReviews(productId) {
  if (!productId) return [];
  const cleanId = String(productId).trim();

  const url = `${getApiBase()}/reviews/product/${encodeURIComponent(cleanId)}`;

  try {
    const res = await fetch(url, {
      next: {
        revalidate: 600,
        tags: ["reviews", `reviews-${cleanId}`],
      },
    });

    if (res.ok) {
      const data = await res.json();
      return data.reviews || data.data || [];
    }
  } catch (err) {
    console.warn(`[getProductReviews] Fetch failed for product ${cleanId}:`, err?.message);
  }

  return [];
}
