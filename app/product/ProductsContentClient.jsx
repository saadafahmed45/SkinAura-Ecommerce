"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { skincareProducts } from "../api/skinData";
import api from "../lib/api";
import {
  FiSliders,
  FiX,
  FiChevronDown,
  FiGrid,
  FiList,
  FiSearch,
  FiCheck,
} from "react-icons/fi";

const RATINGS = [4, 3, 2];
const PRICE_MAX = 10000;

export default function ProductsContentClient({
  initialCategories = [],
  initialProductsData = null,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial category from URL if present
  const categoryParam = searchParams.get("category") || "all";

  const [products, setProducts] = useState(initialProductsData?.products || []);
  const [categories, setCategories] = useState([
    "all",
    ...(initialCategories?.map((c) => c.name).filter(Boolean) || []),
  ]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(initialProductsData?.total || 0);
  const [totalPages, setTotalPages] = useState(initialProductsData?.totalPages || 1);

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [selectedRating, setSelectedRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [gridView, setGridView] = useState(true);

  const isInitialMount = useRef(Boolean(initialProductsData?.products?.length > 0));
  const productsPerPage = 8;

  // Sync category, search, and sort states when URL changes (e.g. header search or navigation)
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    } else {
      setSelectedCategory("all");
    }

    const urlSearch = searchParams.get("search");
    if (urlSearch !== null) {
      setSearchQuery(urlSearch);
    }

    const urlSort = searchParams.get("sort");
    if (urlSort) {
      setSortOption(urlSort);
    }
  }, [searchParams]);

  // If server didn't provide categories, fetch once as fallback
  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) return;

    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        const cats = res.data?.categories || res.data?.data || [];
        const names = cats.map((c) => c.name).filter(Boolean);
        setCategories(["all", ...names]);
      } catch {
        setCategories(["all", "Facewash", "Cream", "Serum", "Sunscreen"]);
      }
    };
    fetchCategories();
  }, [initialCategories]);

  // Update category and sync with URL query parameters
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);

    const params = new URLSearchParams(searchParams.toString());
    if (cat && cat !== "all") {
      params.set("category", cat);
    } else {
      params.delete("category");
    }
    params.delete("page"); // Reset page on category switch

    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  };

  // Fetch products with current filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== "all") {
        params.set("category", selectedCategory);
      }
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
      // Fallback to local skincareProducts when API is unreachable on mobile or offline
      let list = [...skincareProducts];
      if (selectedCategory && selectedCategory !== "all") {
        list = list.filter(
          (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
        );
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        list = list.filter(
          (p) =>
            p.name?.toLowerCase().includes(q) ||
            p.brand?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q)
        );
      }
      if (minPrice > 0) list = list.filter((p) => (p.price || 0) >= minPrice);
      if (maxPrice < PRICE_MAX) list = list.filter((p) => (p.price || 0) <= maxPrice);
      if (selectedRating > 0) list = list.filter((p) => (p.rating || 0) >= selectedRating);

      if (sortOption === "price-low") {
        list.sort((a, b) => (a.price || 0) - (b.price || 0));
      } else if (sortOption === "price-high") {
        list.sort((a, b) => (b.price || 0) - (a.price || 0));
      } else if (sortOption === "rating") {
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      setTotal(list.length);
      setTotalPages(Math.ceil(list.length / productsPerPage) || 1);
      const start = (currentPage - 1) * productsPerPage;
      setProducts(list.slice(start, start + productsPerPage));
    } finally {
      setLoading(false);
    }
  }, [
    selectedCategory,
    sortOption,
    currentPage,
    minPrice,
    maxPrice,
    selectedRating,
    searchQuery,
  ]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
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

    // Clear category param from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("page");
    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  };

  const isCategoryActive = selectedCategory && selectedCategory !== "all";

  const activeFilterCount = [
    isCategoryActive,
    minPrice > 0,
    maxPrice < PRICE_MAX,
    selectedRating > 0,
    searchQuery.trim().length > 0,
  ].filter(Boolean).length;

  // Sidebar component for both desktop and mobile drawer
  const SidebarContent = () => (
    <div className="space-y-7">
      {/* Search within filter */}
      <div>
        <label className="text-[10px] uppercase tracking-[0.18em] text-skin-charcoal/50 font-bold block mb-2.5">
          Search
        </label>
        <div className="flex items-center gap-2 bg-[#F8F6F2] border border-skin-sand/40 rounded-lg px-3 py-2">
          <FiSearch size={13} className="text-skin-charcoal/40 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, active..."
            className="bg-transparent text-xs text-skin-charcoal placeholder-skin-charcoal/35 outline-none flex-1 min-w-0"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="text-skin-charcoal/40 hover:text-skin-charcoal"
            >
              <FiX size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Categories List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-[10px] uppercase tracking-[0.2em] text-skin-charcoal/50 font-bold">
            Categories
          </label>
          {isCategoryActive && (
            <button
              onClick={() => handleCategoryChange("all")}
              className="text-[10px] text-skin-terracotta hover:underline font-medium"
            >
              Reset
            </button>
          )}
        </div>
        <ul className="space-y-0.5">
          {categories.map((cat) => {
            const isSelected =
              selectedCategory?.toLowerCase() === cat?.toLowerCase();
            return (
              <li
                key={cat}
                onClick={() => {
                  handleCategoryChange(cat);
                  setIsMobileFilterOpen(false);
                }}
                className={`cursor-pointer px-3 py-2 rounded-lg text-xs transition-all duration-150 flex items-center justify-between ${
                  isSelected
                    ? "bg-skin-charcoal/5 text-skin-charcoal font-semibold"
                    : "text-skin-charcoal/60 hover:text-skin-charcoal hover:bg-skin-sand/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-1 h-1 rounded-full flex-shrink-0 ${
                      isSelected ? "bg-skin-terracotta" : "bg-skin-sand"
                    }`}
                  />
                  <span>{cat === "all" ? "All Products" : cat}</span>
                </div>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-skin-terracotta" />
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-[10px] uppercase tracking-[0.2em] text-skin-charcoal/50 font-bold block mb-3">
          Price Range (Rs.)
        </label>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-skin-charcoal/60 font-mono">
            <span>Rs. {minPrice}</span>
            <span>Rs. {maxPrice}</span>
          </div>
          <input
            type="range"
            min={0}
            max={PRICE_MAX}
            step={100}
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="w-full accent-skin-terracotta cursor-pointer"
          />
          <div className="flex items-center gap-2 pt-1">
            <input
              type="number"
              min={0}
              max={maxPrice}
              value={minPrice}
              onChange={(e) => {
                setMinPrice(Number(e.target.value));
                setCurrentPage(1);
              }}
              placeholder="Min"
              className="w-1/2 px-2.5 py-1.5 border border-skin-sand/40 rounded-lg text-xs bg-[#F8F6F2] text-skin-charcoal outline-none"
            />
            <span className="text-skin-charcoal/40 text-xs">-</span>
            <input
              type="number"
              min={minPrice}
              max={PRICE_MAX}
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setCurrentPage(1);
              }}
              placeholder="Max"
              className="w-1/2 px-2.5 py-1.5 border border-skin-sand/40 rounded-lg text-xs bg-[#F8F6F2] text-skin-charcoal outline-none"
            />
          </div>
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="text-[10px] uppercase tracking-[0.2em] text-skin-charcoal/50 font-bold block mb-3">
          Customer Rating
        </label>
        <div className="space-y-1.5">
          {RATINGS.map((star) => (
            <label
              key={star}
              className="flex items-center gap-2.5 text-xs text-skin-charcoal/70 cursor-pointer hover:text-skin-charcoal"
            >
              <input
                type="radio"
                name="rating"
                checked={selectedRating === star}
                onChange={() => {
                  setSelectedRating(selectedRating === star ? 0 : star);
                  setCurrentPage(1);
                }}
                className="accent-skin-terracotta"
              />
              <div className="flex items-center gap-1">
                <span>{star}★ & Above</span>
              </div>
            </label>
          ))}
          {selectedRating > 0 && (
            <button
              onClick={() => {
                setSelectedRating(0);
                setCurrentPage(1);
              }}
              className="text-[10px] text-skin-terracotta hover:underline mt-1 block"
            >
              Clear rating filter
            </button>
          )}
        </div>
      </div>

      {/* Reset All */}
      {activeFilterCount > 0 && (
        <button
          onClick={resetFilters}
          className="w-full py-2.5 rounded-lg border border-skin-terracotta text-skin-terracotta text-xs font-semibold hover:bg-skin-terracotta/5 transition-colors"
        >
          Reset All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FCFAF7]">
      {/* ── HEADER HERO STRIP ── */}
      <div className="bg-skin-charcoal text-white pt-28 pb-12 px-5 sm:px-8 md:px-12 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-skin-terracotta font-bold">
              The Formulation Archive
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium">
              {selectedCategory && selectedCategory !== "all"
                ? `${selectedCategory} Collection`
                : "All Formulations"}
            </h1>
            <p className="text-xs sm:text-sm text-white/60 font-light max-w-md">
              Evidence-based skincare targeted to protect, nourish, and visibly renew every complexion.
            </p>
          </div>

          <div className="text-xs text-white/50">
            Showing <strong className="text-white font-medium">{products.length}</strong> of{" "}
            <strong className="text-white font-medium">{total}</strong> products
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT: SIDEBAR + GRID ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 py-10">
        {/* Top Control Bar: Mobile Filter Toggle + Sorting + Layout View */}
        <div className="flex items-center justify-between gap-4 pb-6 mb-8 border-b border-skin-sand/40">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-skin-sand/60 bg-white text-xs font-semibold text-skin-charcoal shadow-xs"
          >
            <FiSliders size={14} className="text-skin-terracotta" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-skin-terracotta text-white text-[9px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Desktop Active Filter Chips */}
          <div className="hidden lg:flex items-center gap-2 flex-wrap flex-1">
            {isCategoryActive && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-skin-terracotta/10 text-skin-terracotta text-xs font-medium">
                <span>Category: {selectedCategory}</span>
                <button
                  onClick={() => handleCategoryChange("all")}
                  className="hover:opacity-75"
                >
                  <FiX size={12} />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-skin-terracotta/10 text-skin-terracotta text-xs font-medium">
                <span>Search: &quot;{searchQuery}&quot;</span>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="hover:opacity-75"
                >
                  <FiX size={12} />
                </button>
              </span>
            )}
            {selectedRating > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-skin-terracotta/10 text-skin-terracotta text-xs font-medium">
                <span>Rating: {selectedRating}★+</span>
                <button
                  onClick={() => {
                    setSelectedRating(0);
                    setCurrentPage(1);
                  }}
                  className="hover:opacity-75"
                >
                  <FiX size={12} />
                </button>
              </span>
            )}
            {activeFilterCount > 1 && (
              <button
                onClick={resetFilters}
                className="text-xs text-skin-charcoal/50 hover:text-skin-terracotta underline font-light"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Right: Sort Dropdown + Grid/List Toggle */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-2 text-xs text-skin-charcoal/60">
              <span className="hidden sm:inline">Sort by:</span>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-white border border-skin-sand/60 rounded-xl px-3.5 py-2 pr-8 text-xs text-skin-charcoal font-medium outline-none cursor-pointer hover:border-skin-sand"
                >
                  <option value="">Featured</option>
                  <option value="top-selling">Top Selling</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
                <FiChevronDown
                  size={13}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-skin-charcoal/40 pointer-events-none"
                />
              </div>
            </div>

            <div className="hidden sm:flex items-center border border-skin-sand/60 rounded-xl overflow-hidden bg-white p-0.5">
              <button
                onClick={() => setGridView(true)}
                className={`p-1.5 rounded-lg transition-colors ${
                  gridView
                    ? "bg-skin-charcoal text-white"
                    : "text-skin-charcoal/40 hover:text-skin-charcoal"
                }`}
                title="Grid View"
              >
                <FiGrid size={14} />
              </button>
              <button
                onClick={() => setGridView(false)}
                className={`p-1.5 rounded-lg transition-colors ${
                  !gridView
                    ? "bg-skin-charcoal text-white"
                    : "text-skin-charcoal/40 hover:text-skin-charcoal"
                }`}
                title="List View"
              >
                <FiList size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── GRID & SIDEBAR SECTION ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-28 bg-white p-6 rounded-2xl border border-skin-sand/40 shadow-xs">
            <SidebarContent />
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-9">
            {/* Loading Skeleton */}
            {loading && (
              <div
                className={`grid ${
                  gridView
                    ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                    : "grid-cols-1 gap-4"
                }`}
              >
                {[...Array(productsPerPage)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-skin-sand/40 p-4 bg-white/60 space-y-4 animate-pulse"
                  >
                    <div className="h-52 bg-skin-sand/40 rounded-xl w-full" />
                    <div className="h-3 w-16 bg-skin-sand/50 rounded" />
                    <div className="h-4 w-3/4 bg-skin-sand/60 rounded" />
                    <div className="h-4 w-20 bg-skin-sand/50 rounded" />
                    <div className="h-9 w-full bg-skin-sand/30 rounded-xl" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && (
              <div className="py-20 text-center bg-white rounded-2xl border border-skin-sand/40 p-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-skin-terracotta/10 text-skin-terracotta flex items-center justify-center mx-auto">
                  <FiSearch size={22} />
                </div>
                <h3 className="text-xl font-serif font-medium text-skin-charcoal">
                  No matching formulations found
                </h3>
                <p className="text-xs text-skin-charcoal/60 max-w-sm mx-auto font-light">
                  Try adjusting your filters, clearing your search query, or checking a different category.
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-skin-charcoal text-white text-xs uppercase tracking-widest font-semibold hover:bg-skin-terracotta transition-colors shadow-xs"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Product Cards Grid */}
            {!loading && products.length > 0 && (
              <div
                className={`grid ${
                  gridView
                    ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                    : "grid-cols-1 gap-4"
                }`}
              >
                {products.map((product) => (
                  <ProductCard product={product} key={product._id || product.id} />
                ))}
              </div>
            )}

            {/* ── PAGINATION CONTROLS ── */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-skin-sand/40">
                <button
                  onClick={() => goToPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3.5 py-2 rounded-xl border border-skin-sand/60 text-xs font-semibold text-skin-charcoal hover:bg-skin-sand/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-skin-charcoal text-white shadow-xs"
                          : "border border-skin-sand/60 text-skin-charcoal hover:bg-skin-sand/40"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-2 rounded-xl border border-skin-sand/60 text-xs font-semibold text-skin-charcoal hover:bg-skin-sand/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE FILTER DRAWER (< lg) ── */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl z-50 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-skin-sand/30">
                <h3 className="text-[11px] uppercase tracking-[0.18em] font-bold text-skin-charcoal/70 flex items-center gap-2">
                  <FiSliders size={12} className="text-skin-terracotta" />
                  Refine Results
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-md bg-skin-sand/50 text-skin-charcoal"
                >
                  <FiX size={13} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-5">
                <SidebarContent />
              </div>
              <div className="px-5 pb-7 pt-4 border-t border-skin-sand/30">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 rounded-xl bg-skin-charcoal text-white text-xs uppercase tracking-widest font-bold hover:bg-skin-charcoal/90 transition-colors"
                >
                  View {total} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
