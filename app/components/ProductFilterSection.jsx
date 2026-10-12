"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowRight,
  FiChevronDown,
  FiFilter,
  FiSparkles,
  FiLayers,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import ProductCard from "./ProductCard";
import { skincareProducts } from "../api/skinData";
import api from "../lib/api";

const ProductFilterSection = ({
  initialCategories = [],
  initialProducts = [],
  badge = "Targeted Care",
  title = "Explore by Category",
  subtitle = "Filter through our clinical botanical formulations. Select a category tab or dropdown to view tailored remedies.",
}) => {
  // Normalize category names
  const categoryList = useMemo(() => {
    const names = [
      "All Formulations",
      ...(Array.isArray(initialCategories) && initialCategories.length > 0
        ? initialCategories.map((c) => (typeof c === "string" ? c : c.name)).filter(Boolean)
        : ["Facewash", "Serum", "Cream", "Sunscreen", "Toner", "Eye Care"]),
    ];
    // Remove duplicates
    return Array.from(new Set(names));
  }, [initialCategories]);

  const [categories, setCategories] = useState(categoryList);
  const [selectedCategory, setSelectedCategory] = useState("All Formulations");
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("featured");

  // If server didn't provide categories, fetch client-side
  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) return;

    let isMounted = true;
    const fetchCats = async () => {
      try {
        const res = await api.get("/categories");
        const list = res.data?.categories || res.data?.data || [];
        const names = list.map((c) => c.name).filter(Boolean);
        if (isMounted && names.length > 0) {
          setCategories(["All Formulations", ...Array.from(new Set(names))]);
        }
      } catch {
        // Fallback already in default state
      }
    };
    fetchCats();
    return () => {
      isMounted = false;
    };
  }, [initialCategories]);

  // If server didn't provide products, fetch client-side
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) return;

    let isMounted = true;
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/products?limit=32");
        const list = res.data?.products || res.data?.data;
        if (isMounted && list && list.length > 0) {
          setProducts(list);
        } else if (isMounted) {
          setProducts(skincareProducts);
        }
      } catch {
        if (isMounted) setProducts(skincareProducts);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAllProducts();
    return () => {
      isMounted = false;
    };
  }, [initialProducts]);

  // Handle category change from Tab or Select
  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  // Filter products by selected category and apply sorting
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by Category name
    if (selectedCategory && selectedCategory !== "All Formulations") {
      list = list.filter((p) => {
        const cat = p.category?.toLowerCase() || "";
        const target = selectedCategory.toLowerCase();
        return cat === target || cat.includes(target) || target.includes(cat);
      });
    }

    // Sort
    if (sortOption === "price-low") {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === "price-high") {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOption === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortOption === "top-selling") {
      list.sort((a, b) => {
        if (Boolean(b.isTopSelling) !== Boolean(a.isTopSelling)) {
          return b.isTopSelling ? 1 : -1;
        }
        return (b.sold || 0) - (a.sold || 0) || (b.rating || 0) - (a.rating || 0);
      });
    }

    return list;
  }, [products, selectedCategory, sortOption]);

  // Compute product counts for each category
  const categoryCounts = useMemo(() => {
    const counts = {};
    counts["All Formulations"] = products.length;
    categoryList.forEach((cat) => {
      if (cat === "All Formulations") return;
      const count = products.filter((p) => {
        const pCat = p.category?.toLowerCase() || "";
        const target = cat.toLowerCase();
        return pCat === target || pCat.includes(target) || target.includes(pCat);
      }).length;
      counts[cat] = count;
    });
    return counts;
  }, [products, categoryList]);

  const activeCategoryUrl =
    selectedCategory === "All Formulations"
      ? "/product"
      : `/product?category=${encodeURIComponent(selectedCategory)}`;

  return (
    <section className="py-20 px-5 sm:px-8 md:px-12 lg:px-20 bg-skin-cream/25 border-t border-b border-skin-sand/30">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skin-terracotta/10 text-skin-terracotta text-[10px] font-bold uppercase tracking-[0.2em]">
              <HiOutlineSparkles size={13} />
              <span>{badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-skin-charcoal font-medium leading-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-skin-charcoal/65 leading-relaxed font-light">
              {subtitle}
            </p>
          </div>

          <Link
            href={activeCategoryUrl}
            className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-bold text-skin-charcoal hover:text-skin-terracotta transition-colors group self-start md:self-end"
          >
            <span>
              {selectedCategory === "All Formulations"
                ? "View All Shop"
                : `View All ${selectedCategory}`}
            </span>
            <FiArrowRight
              size={14}
              className="group-hover:translate-x-1.5 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* ── FILTER CONTROLS BAR (TAB + SELECT DUAL CONTROLS) ── */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-skin-sand/60 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* 1. CATEGORY TABS (Desktop & Tablet horizontal tabs) */}
          <div className="w-full lg:max-w-3xl overflow-x-auto scrollbar-none py-1">
            <div className="flex items-center gap-2 min-w-max">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count = categoryCounts[cat];
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`relative px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-skin-terracotta text-white shadow-sm shadow-skin-terracotta/30"
                        : "bg-skin-cream/40 text-skin-charcoal/70 hover:text-skin-charcoal hover:bg-skin-sand/50 border border-skin-sand/40"
                    }`}
                  >
                    <span>{cat}</span>
                    {count !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-skin-sand/70 text-skin-charcoal/60"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. DUAL SELECT CONTROLS (CATEGORY SELECT + SORT SELECT) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-skin-sand/30">
            
            {/* Category Select Dropdown (Quick picker on mobile/all screens) */}
            <div className="relative flex-1 sm:flex-initial min-w-[170px]">
              <label htmlFor="category-select" className="sr-only">
                Filter by Category
              </label>
              <div className="relative">
                <FiLayers
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-skin-terracotta pointer-events-none"
                />
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="w-full appearance-none bg-[#FAF8F5] border border-skin-sand/70 rounded-xl pl-9 pr-8 py-2.5 text-xs text-skin-charcoal font-medium outline-none cursor-pointer hover:border-skin-terracotta/50 focus:border-skin-terracotta transition-colors"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} {categoryCounts[cat] !== undefined ? `(${categoryCounts[cat]})` : ""}
                    </option>
                  ))}
                </select>
                <FiChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-skin-charcoal/40 pointer-events-none"
                />
              </div>
            </div>

            {/* Sort Select Dropdown */}
            <div className="relative flex-1 sm:flex-initial min-w-[150px]">
              <label htmlFor="sort-select" className="sr-only">
                Sort Products
              </label>
              <select
                id="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full appearance-none bg-[#FAF8F5] border border-skin-sand/70 rounded-xl px-3.5 pr-8 py-2.5 text-xs text-skin-charcoal font-medium outline-none cursor-pointer hover:border-skin-terracotta/50 focus:border-skin-terracotta transition-colors"
              >
                <option value="featured">Sort: Featured</option>
                <option value="top-selling">Top Selling</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <FiChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-skin-charcoal/40 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* ── FILTER STATUS BAR ── */}
        <div className="flex items-center justify-between text-xs text-skin-charcoal/60 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-skin-terracotta" />
            <span>
              Showing{" "}
              <strong className="text-skin-charcoal font-semibold">
                {filteredProducts.length}
              </strong>{" "}
              formulations in{" "}
              <span className="text-skin-terracotta font-medium">
                {selectedCategory}
              </span>
            </span>
          </div>

          {selectedCategory !== "All Formulations" && (
            <button
              type="button"
              onClick={() => handleCategorySelect("All Formulations")}
              className="text-[11px] uppercase tracking-wider text-skin-charcoal/50 hover:text-skin-terracotta underline cursor-pointer"
            >
              Reset filter
            </button>
          )}
        </div>

        {/* ── LOADING SKELETON ── */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-skin-sand/40 p-4 bg-skin-cream/40 space-y-4 animate-pulse"
              >
                <div className="h-52 bg-skin-sand/50 rounded-xl w-full" />
                <div className="h-3 w-20 bg-skin-sand/60 rounded" />
                <div className="h-5 w-3/4 bg-skin-sand/60 rounded" />
                <div className="h-4 w-24 bg-skin-sand/50 rounded" />
                <div className="h-9 w-full bg-skin-sand/40 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* ── ANIMATED PRODUCT GRID ── */}
        {!loading && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${sortOption}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {filteredProducts.slice(0, 8).map((product, idx) => {
                const key = product._id || product.id || idx;
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.04, duration: 0.2 }}
                    className="h-full flex flex-col"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-skin-sand/40 p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-skin-terracotta/10 text-skin-terracotta flex items-center justify-center mx-auto">
              <FiFilter size={20} />
            </div>
            <h3 className="text-lg font-serif text-skin-charcoal font-medium">
              No products found in &quot;{selectedCategory}&quot;
            </h3>
            <p className="text-xs text-skin-charcoal/60 max-w-sm mx-auto">
              We currently don&apos;t have any active formulas listed under this category.
              Try selecting another category or view all formulations.
            </p>
            <button
              type="button"
              onClick={() => handleCategorySelect("All Formulations")}
              className="px-6 py-2.5 rounded-xl bg-skin-charcoal text-white text-xs font-semibold hover:bg-skin-terracotta transition-colors shadow-xs"
            >
              View All Formulations
            </button>
          </div>
        )}

        {/* ── BOTTOM CTA ── */}
        <div className="flex justify-center pt-4">
          <Link href={activeCategoryUrl}>
            <button
              type="button"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-skin-charcoal text-skin-charcoal hover:bg-skin-charcoal hover:text-white transition-all duration-300 text-xs uppercase tracking-widest font-bold shadow-xs active:scale-95"
            >
              <span>
                {selectedCategory === "All Formulations"
                  ? "Explore Complete Collection"
                  : `Explore More ${selectedCategory}`}
              </span>
              <FiArrowRight size={14} />
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ProductFilterSection;
