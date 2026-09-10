"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
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

function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial category from URL if present
  const categoryParam = searchParams.get("category") || "all";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["all"]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [selectedRating, setSelectedRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [gridView, setGridView] = useState(true);

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

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        const cats = res.data?.categories || res.data?.data || [];
        const names = cats.map((c) => c.name).filter(Boolean);
        setCategories(["all", ...names]);
      } catch {
        // Fallback default skincare categories if API offline
        setCategories(["all", "Facewash", "Cream", "Serum", "Sunscreen"]);
      }
    };
    fetchCategories();
  }, []);

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
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="w-full accent-skin-terracotta cursor-pointer"
          />
          <div className="flex gap-2 mt-1">
            <input
              type="number"
              value={minPrice}
              min={0}
              max={maxPrice}
              onChange={(e) => {
                setMinPrice(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full border border-skin-sand/60 rounded-xl px-3 py-2 text-xs text-skin-charcoal outline-none focus:border-skin-sage bg-white"
              placeholder="Min"
            />
            <input
              type="number"
              value={maxPrice}
              min={minPrice}
              max={PRICE_MAX}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full border border-skin-sand/60 rounded-xl px-3 py-2 text-xs text-skin-charcoal outline-none focus:border-skin-sage bg-white"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="text-[10px] uppercase tracking-[0.18em] text-skin-charcoal/50 font-bold block mb-2.5">
          Minimum Rating
        </label>
        <div className="space-y-2">
          <label
            onClick={() => {
              setSelectedRating(0);
              setCurrentPage(1);
            }}
            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs transition-all duration-150 ${
              selectedRating === 0
                ? "bg-skin-charcoal/5 text-skin-charcoal font-semibold"
                : "text-skin-charcoal/60 hover:text-skin-charcoal hover:bg-skin-sand/40"
            }`}
          >
            <span>All Ratings</span>
            {selectedRating === 0 && <FiCheck size={12} />}
          </label>
          {RATINGS.map((r) => (
            <label
              key={r}
              onClick={() => {
                setSelectedRating(r);
                setCurrentPage(1);
              }}
              className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs transition-all duration-150 ${
                selectedRating === r
                  ? "bg-skin-charcoal/5 text-skin-charcoal font-semibold"
                  : "text-skin-charcoal/60 hover:text-skin-charcoal hover:bg-skin-sand/40"
              }`}
            >
              <span className="text-[13px] tracking-widest text-skin-gold">
                {"★".repeat(r)}
                <span className="text-skin-sand/60">{"★".repeat(5 - r)}</span>
              </span>
              {selectedRating === r && (
                <FiCheck size={11} className="text-skin-terracotta" />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      {activeFilterCount > 0 && (
        <button
          onClick={resetFilters}
          className="w-full py-2 rounded-lg border border-skin-sand/50 text-skin-charcoal/60 text-[11px] font-medium hover:border-skin-terracotta hover:text-skin-terracotta transition-all duration-200"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* ── Premium Page Header ── */}
      <div className="relative pt-24 pb-0 overflow-hidden bg-gradient-to-br from-[#FAF7F2] via-white to-[#F5EFE8] border-b border-skin-sand/30">
        {/* Decorative blobs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-skin-terracotta/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-skin-sage/10 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-skin-charcoal/40">
              <li>
                <Link href="/" className="hover:text-skin-terracotta transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-skin-sand/70">/</li>
              <li>
                <button
                  onClick={() => handleCategoryChange("all")}
                  className={`hover:text-skin-terracotta transition-colors ${!isCategoryActive ? "text-skin-charcoal/70 font-semibold" : ""}`}
                >
                  Products
                </button>
              </li>
              {isCategoryActive && (
                <>
                  <li className="text-skin-sand/70">/</li>
                  <li className="text-skin-terracotta font-bold capitalize">{selectedCategory}</li>
                </>
              )}
            </ol>
          </nav>

          {/* Main Header Content */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8">
            <div className="space-y-3">
              {/* Category badge */}
              {isCategoryActive && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skin-terracotta/10 border border-skin-terracotta/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-skin-terracotta" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-skin-terracotta">
                    {selectedCategory}
                  </span>
                </div>
              )}

              <h1 className="text-4xl sm:text-5xl font-serif text-skin-charcoal font-normal tracking-tight capitalize leading-tight">
                {isCategoryActive ? selectedCategory : "All Products"}
              </h1>

              <p className="text-sm text-skin-charcoal/50 font-light max-w-md leading-relaxed">
                {isCategoryActive
                  ? `Carefully formulated ${selectedCategory.toLowerCase()} solutions developed with high-efficacy botanical ingredients.`
                  : "Explore our complete range of clean, dermatologist-inspired daily skincare essentials."}
              </p>
            </div>

            {/* Product count pill */}
            <div className="flex items-center gap-3 self-start md:self-end">
              <div className="px-4 py-2 rounded-full bg-white border border-skin-sand/50 shadow-sm flex items-center gap-2">
                <span className="text-lg font-serif font-medium text-skin-charcoal">{total}</span>
                <span className="text-[11px] uppercase tracking-[0.15em] text-skin-charcoal/50 font-medium">
                  {total === 1 ? "Product" : "Products"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 pt-7 pb-14">
        {/* ── Prominent Search Bar (mobile + desktop) ── */}
        <div className="mb-5">
          <div className="relative max-w-2xl">
            <FiSearch
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-skin-charcoal/40 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search products, ingredients, concerns…"
              className="w-full bg-white border border-skin-sand/50 rounded-full pl-11 pr-10 py-3 text-sm text-skin-charcoal placeholder-skin-charcoal/35 outline-none focus:border-skin-charcoal/40 transition-colors shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-skin-charcoal/40 hover:text-skin-charcoal transition-colors"
                aria-label="Clear search"
              >
                <FiX size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Category Navigation Bar */}
        <div className="mb-8 pb-3 border-b border-skin-sand/30">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
            {categories.map((cat) => {
              const isSelected =
                selectedCategory?.toLowerCase() === cat?.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs tracking-wider transition-all duration-200 font-medium ${
                    isSelected
                      ? "bg-skin-charcoal text-white shadow-sm"
                      : "bg-white text-skin-charcoal/70 border border-skin-sand/60 hover:border-skin-charcoal/50 hover:text-skin-charcoal"
                  }`}
                >
                  {cat === "all" ? "All Products" : cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-8 lg:gap-10">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-skin-sand/30 p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-skin-sand/30">
                <h3 className="text-[11px] uppercase tracking-[0.18em] font-bold text-skin-charcoal/70 flex items-center gap-2">
                  <FiSliders size={12} className="text-skin-terracotta" />
                  Refine
                </h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-[10px] text-skin-terracotta hover:underline font-semibold uppercase tracking-wider"
                  >
                    Clear ({activeFilterCount})
                  </button>
                )}
              </div>
              <SidebarContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs text-skin-charcoal/50 uppercase tracking-wider">
                  Showing{" "}
                  <span className="text-skin-charcoal font-semibold">
                    {total}
                  </span>{" "}
                  {isCategoryActive ? `${selectedCategory.toLowerCase()} ` : ""}
                  results
                </p>

                {/* Active Filter Pills */}
                {activeFilterCount > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    {isCategoryActive && (
                      <span className="inline-flex items-center gap-1.5 bg-skin-sand/40 text-skin-charcoal text-[11px] px-3 py-1 rounded-full font-medium border border-skin-sand/70">
                        <span>Category: {selectedCategory}</span>
                        <button
                          onClick={() => handleCategoryChange("all")}
                          aria-label="Remove category filter"
                          className="text-skin-charcoal/50 hover:text-skin-terracotta transition-colors"
                        >
                          <FiX size={11} />
                        </button>
                      </span>
                    )}

                    {searchQuery.trim() && (
                      <span className="inline-flex items-center gap-1.5 bg-skin-sand/40 text-skin-charcoal text-[11px] px-3 py-1 rounded-full font-medium border border-skin-sand/70">
                        <span>Search: "{searchQuery}"</span>
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setCurrentPage(1);
                          }}
                          aria-label="Clear search"
                          className="text-skin-charcoal/50 hover:text-skin-terracotta transition-colors"
                        >
                          <FiX size={11} />
                        </button>
                      </span>
                    )}

                    {selectedRating > 0 && (
                      <span className="inline-flex items-center gap-1.5 bg-skin-sand/40 text-skin-charcoal text-[11px] px-3 py-1 rounded-full font-medium border border-skin-sand/70">
                        <span>{"★".repeat(selectedRating)}+</span>
                        <button
                          onClick={() => {
                            setSelectedRating(0);
                            setCurrentPage(1);
                          }}
                          aria-label="Remove rating filter"
                          className="text-skin-charcoal/50 hover:text-skin-terracotta transition-colors"
                        >
                          <FiX size={11} />
                        </button>
                      </span>
                    )}

                    {(minPrice > 0 || maxPrice < PRICE_MAX) && (
                      <span className="inline-flex items-center gap-1.5 bg-skin-sand/40 text-skin-charcoal text-[11px] px-3 py-1 rounded-full font-medium border border-skin-sand/70">
                        <span>
                          Rs. {minPrice}–{maxPrice}
                        </span>
                        <button
                          onClick={() => {
                            setMinPrice(0);
                            setMaxPrice(PRICE_MAX);
                            setCurrentPage(1);
                          }}
                          aria-label="Reset price filter"
                          className="text-skin-charcoal/50 hover:text-skin-terracotta transition-colors"
                        >
                          <FiX size={11} />
                        </button>
                      </span>
                    )}

                    <button
                      onClick={resetFilters}
                      className="text-[11px] text-skin-terracotta hover:underline font-medium self-center ml-1"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-full border border-skin-sand/50 bg-white text-xs font-medium text-skin-charcoal"
                >
                  <FiSliders size={13} className="text-skin-terracotta" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-skin-terracotta text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Grid / List toggle */}
                <div className="hidden sm:flex items-center gap-0.5 bg-skin-sand/30 border border-skin-sand/50 rounded-lg p-0.5">
                  <button
                    onClick={() => setGridView(true)}
                    aria-label="Grid view"
                    className={`p-1.5 rounded-md transition-all ${
                      gridView
                        ? "bg-white text-skin-charcoal shadow-sm"
                        : "text-skin-charcoal/40 hover:text-skin-charcoal"
                    }`}
                  >
                    <FiGrid size={13} />
                  </button>
                  <button
                    onClick={() => setGridView(false)}
                    aria-label="List view"
                    className={`p-1.5 rounded-md transition-all ${
                      !gridView
                        ? "bg-white text-skin-charcoal shadow-sm"
                        : "text-skin-charcoal/40 hover:text-skin-charcoal"
                    }`}
                  >
                    <FiList size={13} />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => {
                      setSortOption(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="appearance-none border border-skin-sand/50 rounded-full pl-4 pr-8 py-2 text-xs font-medium text-skin-charcoal bg-white focus:outline-none focus:border-skin-charcoal/40 cursor-pointer tracking-wide"
                  >
                    <option value="">Sort: Featured</option>
                    <option value="name-asc">Name A → Z</option>
                    <option value="price-low">Price: Low → High</option>
                    <option value="price-high">Price: High → Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <FiChevronDown
                    size={11}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-skin-charcoal/40 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Products Grid / Loading / Empty States */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-10 h-10 border-2 border-skin-terracotta border-t-transparent rounded-full animate-spin" />
                <p className="text-xs uppercase tracking-wider text-skin-charcoal/50">
                  Loading {isCategoryActive ? selectedCategory : "products"}...
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 px-6 bg-white rounded-2xl border border-skin-sand/30 shadow-sm max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-full bg-skin-cream flex items-center justify-center mx-auto mb-4 text-skin-terracotta">
                  <FiSearch size={20} />
                </div>
                <h3 className="text-base font-serif text-skin-charcoal font-medium mb-1">
                  No products found
                </h3>
                <p className="text-skin-charcoal/50 text-xs mb-6 font-light">
                  {isCategoryActive
                    ? `We couldn't find any products in "${selectedCategory}" matching your criteria.`
                    : "No products matched your selected filters."}
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-xl bg-skin-charcoal text-white text-xs uppercase tracking-widest font-bold hover:bg-skin-terracotta transition-colors shadow-sm"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                <motion.div
                  layout
                  className={`grid gap-3 sm:gap-5 ${
                    gridView
                      ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
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
                      : "bg-white text-skin-charcoal border-skin-sand hover:bg-skin-charcoal hover:text-white hover:border-skin-charcoal shadow-sm"
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
                          : "bg-white text-skin-charcoal border-skin-sand hover:bg-skin-charcoal hover:text-white hover:border-skin-charcoal shadow-sm"
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
                      : "bg-white text-skin-charcoal border-skin-sand hover:bg-skin-charcoal hover:text-white hover:border-skin-charcoal shadow-sm"
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
              className="fixed top-0 left-0 h-full w-[85%] max-w-xs bg-[#FDFBF7] z-50 lg:hidden flex flex-col"
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

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-skin-cream/30 gap-4">
          <div className="w-10 h-10 border-2 border-skin-terracotta border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-skin-charcoal/50 font-bold">
            Loading Catalog...
          </p>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
