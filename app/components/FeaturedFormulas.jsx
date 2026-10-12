"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { skincareProducts } from "../api/skinData";
import api from "../lib/api";

const FeaturedFormulas = ({
  initialProducts = null,
  badge = "Featured Formula",
  title = "Featured Formulations",
  subtitle = "Highlight across store navigation and category recommendations — proven botanical and clinical solutions curated for visible transformation.",
}) => {
  // Helper to ensure strictly only featured products are included
  const filterFeatured = (list) => {
    if (!Array.isArray(list)) return [];
    return list.filter((p) => Boolean(p.isFeatured));
  };

  const initialFiltered = filterFeatured(initialProducts);
  const [products, setProducts] = useState(initialFiltered);
  const [loading, setLoading] = useState(
    !initialProducts || initialFiltered.length === 0
  );

  useEffect(() => {
    // If server provided products and has featured items, use them directly
    const serverFeatured = filterFeatured(initialProducts);
    if (serverFeatured.length > 0) {
      setProducts(serverFeatured);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        // Fetch featured products directly from the API (filtered by isFeatured=true)
        const res = await api.get("/products?isFeatured=true&limit=8");
        const list = res.data?.products || res.data?.data;
        const validList = filterFeatured(list);

        if (isMounted && validList.length > 0) {
          setProducts(validList);
        } else {
          // Fallback if API returns empty list (only products with isFeatured: true)
          const fallbackSorted = filterFeatured(skincareProducts).sort(
            (a, b) =>
              (b.sold || 0) - (a.sold || 0) || (b.rating || 0) - (a.rating || 0)
          );
          if (isMounted) setProducts(fallbackSorted.slice(0, 8));
        }
      } catch (err) {
        console.warn(
          "[FeaturedFormulas] API fetch error, using fallback:",
          err?.message
        );
        const fallbackSorted = filterFeatured(skincareProducts).sort(
          (a, b) =>
            (b.sold || 0) - (a.sold || 0) || (b.rating || 0) - (a.rating || 0)
        );
        if (isMounted) setProducts(fallbackSorted.slice(0, 8));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeatured();
    return () => {
      isMounted = false;
    };
  }, [initialProducts]);

  return (
    <section className="py-20 px-5 sm:px-8 md:px-12 lg:px-20 bg-skin-cream/40 border-t border-b border-skin-sand/50">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skin-terracotta/10 text-skin-terracotta text-[10px] font-bold uppercase tracking-[0.2em]">
              <HiOutlineSparkles size={13} />
              <span>✨ {badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-skin-charcoal font-medium leading-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-skin-charcoal/65 leading-relaxed font-light">
              {subtitle}
            </p>
          </div>

          <Link
            href="/product?isFeatured=true"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] font-bold text-skin-charcoal hover:text-skin-terracotta transition-colors group self-start md:self-end"
          >
            <span>Explore All</span>
            <FiArrowRight
              size={14}
              className="group-hover:translate-x-1.5 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* ── LOADING SKELETON ── */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-skin-sand/40 p-4 bg-skin-cream/30 space-y-4 animate-pulse"
              >
                <div className="h-56 bg-skin-sand/50 rounded-xl w-full" />
                <div className="h-3 w-20 bg-skin-sand/60 rounded" />
                <div className="h-5 w-3/4 bg-skin-sand/60 rounded" />
                <div className="h-4 w-24 bg-skin-sand/50 rounded" />
                <div className="h-9 w-full bg-skin-sand/40 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* ── FEATURED PRODUCTS GRID ── */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {products.map((product, idx) => {
              const key = product._id || product.id || idx;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx % 4) * 0.08, duration: 0.35 }}
                  className="h-full flex flex-col"
                >
                  <ProductCard product={product} />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12 text-skin-charcoal/50 text-sm">
            No featured formulas available at this moment.
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedFormulas;
