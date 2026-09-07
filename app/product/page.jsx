"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductCard";
import api from "../lib/api";
import {
  FiSliders,
  FiX,
  FiChevronDown,
  FiGrid,
  FiList,
  FiSearch,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

const RATINGS = [4, 3, 2];
const PRICE_MAX = 10000;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["all"]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [selectedRating, setSelectedRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [gridView, setGridView] = useState(true);

  const productsPerPage = 8;

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        const cats = res.data?.categories || res.data?.data || [];
        const names = cats.map((c) => c.name).filter(Boolean);
        setCategories(["all", ...names]);
      } catch {
        // fallback - leave as ["all"]
      }
    };
    fetchCategories();
  }, []);

  // Fetch products with filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory);
      if (sortOption) params.set("sort", sortOption);
      if (minPrice > 0) params.set("minPrice", minPrice);
      if (maxPrice < PRICE_MAX) params.set("maxPrice", maxPrice);
      if (selectedRating > 0) params.set("rating", selectedRating);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      params.set("page", currentPage);
      params.set("limit", productsPerPage);

      const res = await api.get(`/products?${params.toString()}`);
      const data = res.data;
      setProducts(data.products || data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, sortOption, currentPage, minPrice, maxPrice, selectedRating, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setMinPrice(0);
    setMaxPrice(PRICE_MAX);
    setSelectedRating(0);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const activeFilterCount = [
    selectedCategory !== "all",
    minPrice > 0,
    maxPrice < PRICE_MAX,
    selectedRating > 0,
    searchQuery.trim().length > 0,
  ].filter(Boolean).length;

  const SidebarContent = () => (
    <div className="space-y-7">
      {/* Search within filter */}
      <div>
        <label className="text-[10px] uppercase tracking-[0.2em] text-skin-charcoal/50 font-bold block mb-3">
          Search
        </label>
        <div className="flex items-center gap-2 bg-skin-cream/80 border border-skin-sand/60 rounded-xl px-3 py-2.5">
          <FiSearch size={13} className="text-skin-charcoal/40 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search products..."
            className="bg-transparent text-xs text-skin-charcoal placeholder-skin-charcoal/35 outline-none flex-1 min-w-0"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="text-[10px] uppercase tracking-[0.2em] text-skin-charcoal/50 font-bold block mb-3">
          Categories
        </label>
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li
              key={cat}
              onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
              className={`cursor-pointer capitalize px-4 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all duration-200 flex items-center justify-between ${
                selectedCategory === cat
                  ? "bg-skin-charcoal text-white shadow-sm"
                  : "text-skin-charcoal/70 hover:bg-skin-sand/70 hover:text-skin-charcoal"
              }`}
            >
              <span>{cat === "all" ? "All Products" : cat}</span>
              {selectedCategory === cat && (
                <span className="w-1.5 h-1.5 rounded-full bg-skin-terracotta" />
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-[10px] uppercase tracking-[0.2em] text-skin-charcoal/50 font-bold block mb-3">
          Price Range
        </label>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-skin-charcoal/60">
            <span>Rs. {minPrice}</span>
            <span>Rs. {maxPrice}</span>
          </div>
          <input
            type="range"
            min={0}
            max={PRICE_MAX}
            value={maxPrice}
            onChange={(e) => { setMaxPrice(Number(e.target.value)); setCurrentPage(1); }}
            className="w-full accent-skin-terracotta cursor-pointer"
          />
          <div className="flex gap-2 mt-1">
            <input
              type="number"
              value={minPrice}
              min={0}
              max={maxPrice}
              onChange={(e) => { setMinPrice(Number(e.target.value)); setCurrentPage(1); }}
              className="w-full border border-skin-sand/60 rounded-xl px-3 py-2 text-xs text-skin-charcoal outline-none focus:border-skin-sage bg-white"
              placeholder="Min"
            />
            <input
              type="number"
              value={maxPrice}
              min={minPrice}
              max={PRICE_MAX}
              onChange={(e) => { setMaxPrice(Number(e.target.value)); setCurrentPage(1); }}
              className="w-full border border-skin-sand/60 rounded-xl px-3 py-2 text-xs text-skin-charcoal outline-none focus:border-skin-sage bg-white"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="text-[10px] uppercase tracking-[0.2em] text-skin-charcoal/50 font-bold block mb-3">
          Minimum Rating
        </label>
        <div className="space-y-2">
          <label
            onClick={() => { setSelectedRating(0); setCurrentPage(1); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer text-xs font-medium transition-all duration-200 ${
              selectedRating === 0
                ? "bg-skin-charcoal text-white"
                : "text-skin-charcoal/70 hover:bg-skin-sand/70"
            }`}
          >
            All Ratings
          </label>
          {RATINGS.map((r) => (
            <label
              key={r}
              onClick={() => { setSelectedRating(r); setCurrentPage(1); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer text-xs font-medium transition-all duration-200 ${
                selectedRating === r
                  ? "bg-skin-charcoal text-white"
                  : "text-skin-charcoal/70 hover:bg-skin-sand/70"
              }`}
            >
              {"★".repeat(r)}{"☆".repeat(5 - r)}
              <span className="opacity-70">& up</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset */}
      {activeFilterCount > 0 && (
        <button
          onClick={resetFilters}
          className="w-full py-2.5 rounded-xl border border-skin-terracotta/50 text-skin-terracotta text-[11px] uppercase tracking-widest font-bold hover:bg-skin-terracotta hover:text-white transition-all duration-300"
        >
          Clear All Filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-skin-cream/30">
      {/* Page Hero */}
      <div className="bg-skin-charcoal pt-28 pb-14 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <ol className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40 mb-5">
            <li>
              <Link href="/" className="hover:text-white/70 transition-colors">
                Home
              </Link>
            </li>
            <span>/</span>
            <li className="text-white/70">Products</li>
          </ol>

          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <HiOutlineSparkles size={16} className="text-skin-terracotta" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-skin-terracotta font-bold">
                  Our Collection
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-white leading-tight">
                Skincare{" "}
                <span className="italic font-light text-skin-sand">Products</span>
              </h1>
            </div>
            <p className="text-sm text-white/50 max-w-xs font-light">
              {total} handcrafted formulations for your unique skin
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="flex gap-8 lg:gap-10">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-skin-sand/40 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-serif font-semibold text-skin-charcoal flex items-center gap-2">
                  <FiSliders size={15} className="text-skin-terracotta" />
                  Filters
                </h3>
                {activeFilterCount > 0 && (
                  <span className="bg-skin-terracotta text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <SidebarContent />
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-xs text-skin-charcoal/50 uppercase tracking-wider">
                  Showing{" "}
                  <span className="text-skin-charcoal font-semibold">
                    {total}
                  </span>{" "}
                  results
                </p>

                {/* Active Filter Pills */}
                {activeFilterCount > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCategory !== "all" && (
                      <span className="inline-flex items-center gap-1.5 bg-skin-charcoal text-white text-[10px] px-3 py-1 rounded-full font-medium">
                        {selectedCategory}
                        <button onClick={() => { setSelectedCategory("all"); setCurrentPage(1); }}>
                          <FiX size={10} />
                        </button>
                      </span>
                    )}
                    {selectedRating > 0 && (
                      <span className="inline-flex items-center gap-1.5 bg-skin-charcoal text-white text-[10px] px-3 py-1 rounded-full font-medium">
                        {"★".repeat(selectedRating)}+
                        <button onClick={() => { setSelectedRating(0); setCurrentPage(1); }}>
                          <FiX size={10} />
                        </button>
                      </span>
                    )}
                    {(minPrice > 0 || maxPrice < PRICE_MAX) && (
                      <span className="inline-flex items-center gap-1.5 bg-skin-charcoal text-white text-[10px] px-3 py-1 rounded-full font-medium">
                        Rs. {minPrice}–{maxPrice}
                        <button onClick={() => { setMinPrice(0); setMaxPrice(PRICE_MAX); setCurrentPage(1); }}>
                          <FiX size={10} />
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-skin-sand/60 bg-white text-xs font-semibold text-skin-charcoal"
                >
                  <FiSliders size={13} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-skin-terracotta text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Grid toggle */}
                <div className="hidden sm:flex items-center gap-1 bg-white border border-skin-sand/60 rounded-xl p-1">
                  <button
                    onClick={() => setGridView(true)}
                    className={`p-1.5 rounded-lg transition-all ${gridView ? "bg-skin-charcoal text-white" : "text-skin-charcoal/50 hover:text-skin-charcoal"}`}
                  >
                    <FiGrid size={14} />
                  </button>
                  <button
                    onClick={() => setGridView(false)}
                    className={`p-1.5 rounded-lg transition-all ${!gridView ? "bg-skin-charcoal text-white" : "text-skin-charcoal/50 hover:text-skin-charcoal"}`}
                  >
                    <FiList size={14} />
                  </button>
                </div>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}
                    className="appearance-none border border-skin-sand/60 rounded-xl pl-4 pr-8 py-2.5 text-xs font-semibold text-skin-charcoal bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-skin-sage cursor-pointer"
                  >
                    <option value="">Sort By</option>
                    <option value="name-asc">Name (A → Z)</option>
                    <option value="price-low">Price: Low → High</option>
                    <option value="price-high">Price: High → Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <FiChevronDown
                    size={12}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-skin-charcoal/50 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-10 h-10 border-2 border-skin-terracotta border-t-transparent rounded-full animate-spin" />
                <p className="text-xs uppercase tracking-wider text-skin-charcoal/50">
                  Loading products...
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-skin-sand/30">
                <p className="text-skin-charcoal/40 text-sm mb-4">
                  No products match your filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-xl bg-skin-charcoal text-white text-xs uppercase tracking-widest font-bold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                <motion.div
                  layout
                  className={`grid gap-5 ${
                    gridView
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {products.map((product, i) => (
                    <motion.div
                      key={product._id || product.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <ProductCard product={product} listView={!gridView} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2 flex-wrap">
                <button
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                  className={`px-5 py-2.5 text-xs uppercase tracking-widest font-bold rounded-xl border transition-all duration-300 ${
                    currentPage === 1
                      ? "cursor-not-allowed opacity-30 bg-white border-skin-sand"
                      : "bg-white text-skin-charcoal border-skin-sand hover:bg-skin-charcoal hover:text-white hover:border-skin-charcoal"
                  }`}
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-10 h-10 rounded-xl border text-xs font-bold transition-all duration-300 ${
                        currentPage === page
                          ? "bg-skin-terracotta text-white border-skin-terracotta shadow-md shadow-skin-terracotta/30"
                          : "bg-white text-skin-charcoal border-skin-sand hover:bg-skin-charcoal hover:text-white hover:border-skin-charcoal"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                  className={`px-5 py-2.5 text-xs uppercase tracking-widest font-bold rounded-xl border transition-all duration-300 ${
                    currentPage === totalPages
                      ? "cursor-not-allowed opacity-30 bg-white border-skin-sand"
                      : "bg-white text-skin-charcoal border-skin-sand hover:bg-skin-charcoal hover:text-white hover:border-skin-charcoal"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="fixed top-0 left-0 h-full w-[85%] max-w-xs bg-white z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-skin-sand/40">
                <h3 className="text-sm font-serif font-semibold text-skin-charcoal flex items-center gap-2">
                  <FiSliders size={14} className="text-skin-terracotta" />
                  Filters
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-skin-sand/60"
                >
                  <FiX size={15} className="text-skin-charcoal" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <SidebarContent />
              </div>
              <div className="px-6 pb-8 pt-4 border-t border-skin-sand/40">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3.5 rounded-xl bg-skin-charcoal text-white text-xs uppercase tracking-widest font-bold"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;
