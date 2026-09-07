"use client";

import { skincareProducts } from "@/app/api/skinData";
import ProductCard from "@/app/components/ProductCard";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import api from "@/app/lib/api";

const CategoryPage = ({ params }) => {
  const unwrappedParams = params && typeof params.then === "function" ? React.use(params) : params;
  const rawId = unwrappedParams?.id || "";
  const categoryName = decodeURIComponent(rawId);

  const fallback = skincareProducts?.filter(
    (item) => item.category?.toLowerCase() === categoryName?.toLowerCase()
  ) || [];

  const [products, setProducts] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCategoryProducts = async () => {
      try {
        const res = await api.get(`/products?category=${encodeURIComponent(categoryName)}`);
        if (isMounted && res.data?.data) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.warn(`[CategoryPage] Failed to fetch products for category ${categoryName}:`, err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (categoryName) {
      fetchCategoryProducts();
    }
    return () => {
      isMounted = false;
    };
  }, [categoryName]);

  return (
    <div className="px-6 md:px-12 lg:px-20 py-28 mx-auto bg-skin-cream/10 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-3 max-w-lg mx-auto mb-16">
        <span className="text-xs uppercase tracking-widest text-skin-terracotta font-bold">Category Collection</span>
        <h2 className="text-4xl md:text-5xl font-serif text-skin-charcoal capitalize font-medium">
          {categoryName}s
        </h2>
        <p className="text-xs uppercase tracking-widest text-skin-charcoal/50">
          Showing {products.length} skincare products
        </p>
      </div>

      {products.length === 0 && !loading ? (
        <div className="text-center py-20 bg-white border border-skin-sand/35 rounded-2xl max-w-md mx-auto space-y-4 shadow-sm">
          <p className="text-skin-charcoal/60 text-sm">
            No products found in the "{categoryName}" category.
          </p>
          <Link
            href="/product"
            className="inline-block bg-skin-charcoal text-white hover:bg-skin-sage text-xs uppercase tracking-widest font-bold px-6 py-3.5 rounded-xl transition"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
