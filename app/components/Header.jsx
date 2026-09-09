"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiShoppingBag,
  FiSearch,
  FiUser,
  FiHeart,
  FiLogOut,
  FiPackage,
  FiShield,
  FiTruck,
  FiArrowRight,
  FiClock,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import AnnouncementBar from "./AnnouncementBar";
import TrackOrderModal from "./TrackOrderModal";
import api from "../lib/api";

const TRENDING_SEARCHES = [
  "Vitamin C Serum",
  "Hydrating Cream",
  "Niacinamide Gel",
  "Daily Sunscreen",
  "Gentle Cleanser",
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [trackOrderOpen, setTrackOrderOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const userMenuRef = useRef(null);
  const searchContainerRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const searchDebounceRef = useRef(null);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems } = useCart();
  const { user, logout, isAdmin } = useAuth();

  // Primary Navigation routes
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/product" },
    { name: "Categories", href: "/category" },
    { name: "New Arrivals", href: "/product?sort=newest" },
    { name: "Best Sellers", href: "/product?isFeatured=true" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("skinaura_recent_searches");
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch {
      // Ignore local storage error
    }
  }, []);

  // Save recent search
  const saveRecentSearch = (term) => {
    if (!term || !term.trim()) return;
    const clean = term.trim();
    try {
      const updated = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("skinaura_recent_searches", JSON.stringify(updated));
    } catch {
      // Ignore storage error
    }
  };

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside detection for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      const isInsideDesktop = searchContainerRef.current && searchContainerRef.current.contains(event.target);
      const isInsideMobile = mobileSearchRef.current && mobileSearchRef.current.contains(event.target);
      if (!isInsideDesktop && !isInsideMobile) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Live product search with debounce
  const fetchSearchResults = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    try {
      const res = await api.get(`/products?search=${encodeURIComponent(query.trim())}&limit=5`);
      const list = res.data?.products || res.data?.data || [];
      setSearchResults(list.slice(0, 5));
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    if (val.trim().length >= 2) {
      setSearchLoading(true);
      searchDebounceRef.current = setTimeout(() => {
        fetchSearchResults(val);
      }, 260);
    } else {
      setSearchResults([]);
      setSearchLoading(false);
    }
  };

  const executeSearch = (term) => {
    const target = term !== undefined ? term : searchQuery;
    if (!target || !target.trim()) return;
    saveRecentSearch(target);
    setIsSearchFocused(false);
    setIsOpen(false);
    router.push(`/product?search=${encodeURIComponent(target.trim())}`);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeSearch();
    } else if (e.key === "Escape") {
      setIsSearchFocused(false);
    }
  };

  // Check active navigation link
  const isLinkActive = (link) => {
    if (link.href === "/") {
      return pathname === "/";
    }
    if (link.href.includes("?")) {
      const [path, query] = link.href.split("?");
      if (pathname !== path) return false;
      const [key, val] = query.split("=");
      return searchParams.get(key) === val;
    }
    return pathname === link.href && !searchParams.toString();
  };

  return (
    <>
      {/* ── UNIFIED STICKY CONTAINER (ALL 3 LEVELS) ── */}
      <header
        className={`sticky top-0 left-0 w-full z-50 transition-shadow duration-300 ${
          isScrolled ? "shadow-md" : "shadow-xs"
        }`}
      >
        {/* ── LEVEL 1: UTILITY / SHOPPING BAR ── */}
        <AnnouncementBar onOpenTrackOrder={() => setTrackOrderOpen(true)} />

        {/* ── LEVEL 2 & 3: MAIN HEADER WRAPPER ── */}
        <div className="w-full bg-white/95 backdrop-blur-md border-b border-skin-sand/60">
          {/* ── LEVEL 2: SEARCH + BRAND + ACTIONS ── */}
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-4 sm:gap-8">
            {/* LEFT: Skin-Aura Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-2.5 shrink-0 group focus:outline-none"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-skin-terracotta/10 flex items-center justify-center transition-all duration-300 group-hover:bg-skin-terracotta/15 group-hover:scale-105">
                <HiSparkles size={16} className="text-skin-terracotta" />
              </div>
              <span className="text-lg sm:text-xl font-serif font-semibold tracking-[0.22em] text-skin-charcoal group-hover:text-skin-terracotta transition-colors">
                SKIN-AURA
              </span>
            </Link>

            {/* CENTER: Desktop Live Search Bar */}
            <div
              ref={searchContainerRef}
              className="hidden lg:flex flex-1 justify-center max-w-[480px] relative"
            >
              <div
                className={`w-full flex items-center bg-skin-cream/80 border rounded-full px-4 py-2 text-xs transition-all duration-300 ${
                  isSearchFocused
                    ? "bg-white border-skin-terracotta/70 ring-3 ring-skin-terracotta/10 shadow-sm"
                    : "border-skin-sand/90 hover:border-skin-terracotta/40 hover:bg-white"
                }`}
              >
                <FiSearch
                  size={15}
                  className={`shrink-0 transition-colors mr-2.5 ${
                    isSearchFocused ? "text-skin-terracotta" : "text-skin-charcoal/40"
                  }`}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search skincare, products & ingredients..."
                  className="w-full bg-transparent text-skin-charcoal placeholder-skin-charcoal/40 outline-none text-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    aria-label="Clear search text"
                    className="p-1 text-skin-charcoal/35 hover:text-skin-charcoal transition-colors ml-1 cursor-pointer"
                  >
                    <FiX size={13} />
                  </button>
                )}
              </div>

              {/* Desktop Live Search Dropdown */}
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-skin-sand/60 overflow-hidden z-50 text-xs"
                  >
                    {/* Trending / Recent when query is empty */}
                    {!searchQuery.trim() && (
                      <div className="p-4 space-y-3">
                        {recentSearches.length > 0 && (
                          <div className="space-y-1.5 pb-2 border-b border-skin-sand/30">
                            <span className="text-[10px] uppercase font-semibold text-skin-charcoal/45 tracking-wider flex items-center gap-1">
                              <FiClock size={11} /> Recent Searches
                            </span>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {recentSearches.map((item) => (
                                <button
                                  key={item}
                                  onClick={() => {
                                    setSearchQuery(item);
                                    executeSearch(item);
                                  }}
                                  className="px-2.5 py-1 rounded-full bg-skin-sand/50 text-[11px] text-skin-charcoal/80 hover:bg-skin-terracotta/15 hover:text-skin-terracotta transition-colors"
                                >
                                  {item}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase font-semibold text-skin-charcoal/45 tracking-wider block">
                            Popular Rituals
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {TRENDING_SEARCHES.map((item) => (
                              <button
                                key={item}
                                onClick={() => {
                                  setSearchQuery(item);
                                  executeSearch(item);
                                }}
                                className="px-2.5 py-1 rounded-full bg-skin-cream border border-skin-sand/80 text-[11px] text-skin-charcoal/75 hover:border-skin-terracotta hover:text-skin-terracotta transition-all"
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Searching spinner */}
                    {searchLoading && (
                      <div className="p-6 text-center text-skin-charcoal/50 flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-skin-terracotta/30 border-t-skin-terracotta rounded-full animate-spin" />
                        <span>Searching Skin-Aura collection...</span>
                      </div>
                    )}

                    {/* Results list */}
                    {!searchLoading && searchQuery.trim() && searchResults.length > 0 && (
                      <div className="divide-y divide-skin-sand/30 max-h-72 overflow-y-auto">
                        <div className="px-4 py-2 bg-skin-cream/40 text-[10px] uppercase tracking-wider font-semibold text-skin-charcoal/50">
                          Matching Products ({searchResults.length})
                        </div>
                        {searchResults.map((product) => {
                          const imageUrl =
                            product.images?.[0] ||
                            product.image ||
                            "https://images.pexels.com/photos/3762756/pexels-photo-3762756.jpeg";
                          return (
                            <Link
                              key={product._id || product.id || product.name}
                              href={`/product/${product._id || product.slug || ""}`}
                              onClick={() => {
                                saveRecentSearch(product.name);
                                setIsSearchFocused(false);
                              }}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-skin-cream/60 transition-colors group"
                            >
                              <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded-md border border-skin-sand shrink-0 bg-skin-sand/20"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-skin-charcoal group-hover:text-skin-terracotta transition-colors truncate">
                                  {product.name}
                                </p>
                                <span className="text-[10px] text-skin-charcoal/50 uppercase tracking-wider">
                                  {product.category || "Skincare"}
                                </span>
                              </div>
                              <span className="font-mono text-xs font-semibold text-skin-charcoal shrink-0">
                                Rs. {product.price}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    {/* No results */}
                    {!searchLoading && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                      <div className="p-6 text-center text-skin-charcoal/60 space-y-1">
                        <p className="font-medium">No botanical solutions found</p>
                        <p className="text-[11px] text-skin-charcoal/45">
                          Try searching for &quot;serum&quot;, &quot;cream&quot;, or &quot;facewash&quot;.
                        </p>
                      </div>
                    )}

                    {/* View all results link */}
                    {searchQuery.trim() && (
                      <button
                        onClick={() => executeSearch()}
                        className="w-full px-4 py-2.5 bg-skin-cream/80 hover:bg-skin-terracotta/10 border-t border-skin-sand/40 text-center font-medium text-[11px] text-skin-terracotta transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>View all results for &quot;{searchQuery}&quot;</span>
                        <FiArrowRight size={12} />
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT: Actions (Account, Wishlist, Cart) */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Desktop Wishlist Icon */}
              <Link
                href="/product?sort=rating"
                title="Wishlist & Favorites"
                aria-label="Wishlist"
                className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center text-skin-charcoal/70 hover:text-skin-terracotta hover:bg-skin-sand/50 transition-all duration-200"
              >
                <FiHeart size={17} />
              </Link>

              {/* Account Dropdown */}
              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    aria-label="User Account Menu"
                    className="flex items-center gap-2 h-9 px-2.5 rounded-lg border border-skin-sand hover:border-skin-terracotta/50 hover:bg-skin-sand/30 transition-all duration-200 cursor-pointer"
                  >
                    <span className="w-5 h-5 rounded-full bg-skin-terracotta text-white text-[10px] font-bold flex items-center justify-center uppercase">
                      {user.name?.[0] || "U"}
                    </span>
                    <span className="text-xs font-medium text-skin-charcoal max-w-[80px] truncate hidden md:inline">
                      {user.name?.split(" ")[0]}
                    </span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    title="Account Sign In"
                    aria-label="Account"
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-skin-charcoal/70 hover:text-skin-charcoal hover:bg-skin-sand/50 transition-all duration-200"
                  >
                    <FiUser size={18} />
                  </Link>
                )}

                {/* Account Menu Dropdown */}
                <AnimatePresence>
                  {user && userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-skin-sand/50 py-1.5 z-50 overflow-hidden text-xs"
                    >
                      <div className="px-3.5 py-2 border-b border-skin-sand/30 bg-skin-cream/30">
                        <p className="font-semibold text-skin-charcoal truncate">{user.name}</p>
                        <p className="text-[10px] text-skin-charcoal/50 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="mt-1 inline-block bg-skin-terracotta/10 text-skin-terracotta text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded">
                            Admin
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        <Link
                          href="/my-orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-2 text-skin-charcoal/85 hover:bg-skin-sand/30 hover:text-skin-terracotta transition-colors"
                        >
                          <FiPackage size={13} className="text-skin-terracotta" />
                          My Orders
                        </Link>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setTrackOrderOpen(true);
                          }}
                          className="w-full flex items-center gap-2 px-3.5 py-2 text-skin-charcoal/85 hover:bg-skin-sand/30 hover:text-skin-terracotta transition-colors text-left cursor-pointer"
                        >
                          <FiTruck size={13} className="text-skin-terracotta" />
                          Track Order
                        </button>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3.5 py-2 text-skin-charcoal/85 hover:bg-skin-sand/30 transition-colors font-medium"
                          >
                            <FiShield size={13} className="text-skin-sage" />
                            Admin Dashboard
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                            router.push("/");
                          }}
                          className="w-full flex items-center gap-2 px-3.5 py-2 text-red-500 hover:bg-red-50 transition-colors text-left border-t border-skin-sand/20 mt-1 cursor-pointer"
                        >
                          <FiLogOut size={13} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart Icon + Badge */}
              <Link
                href="/cart"
                title="Shopping Bag"
                aria-label={`Shopping Bag with ${cartItems.length} items`}
                className="relative w-9 h-9 rounded-lg flex items-center justify-center text-skin-charcoal hover:text-skin-terracotta hover:bg-skin-sand/50 transition-all duration-200"
              >
                <FiShoppingBag size={18} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-skin-terracotta text-white text-[9px] w-4 h-4 flex items-center justify-center font-bold rounded-full shadow-xs">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-skin-charcoal hover:bg-skin-sand/50 transition-colors cursor-pointer"
              >
                {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>

          {/* ── MOBILE ROW 2: FULL-WIDTH SEARCH BAR (< lg) ── */}
          <div ref={mobileSearchRef} className="lg:hidden px-4 pb-3 relative">
            <div
              className={`w-full flex items-center bg-skin-cream/80 border rounded-full px-3.5 py-2 text-xs transition-all ${
                isSearchFocused
                  ? "bg-white border-skin-terracotta ring-2 ring-skin-terracotta/10"
                  : "border-skin-sand/90"
              }`}
            >
              <FiSearch size={14} className="text-skin-charcoal/40 shrink-0 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search products, brands..."
                className="w-full bg-transparent text-skin-charcoal placeholder-skin-charcoal/45 outline-none text-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="p-1 text-skin-charcoal/40 hover:text-skin-charcoal"
                >
                  <FiX size={12} />
                </button>
              )}
            </div>

            {/* Mobile Search Dropdown */}
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute top-full left-4 right-4 mt-1.5 bg-white rounded-xl shadow-2xl border border-skin-sand/60 overflow-hidden z-50 text-xs max-h-72 overflow-y-auto"
                >
                  {/* Results */}
                  {searchResults.length > 0 && (
                    <div className="divide-y divide-skin-sand/30">
                      {searchResults.map((product) => {
                        const img =
                          product.images?.[0] ||
                          product.image ||
                          "https://images.pexels.com/photos/3762756/pexels-photo-3762756.jpeg";
                        return (
                          <Link
                            key={product._id || product.id || product.name}
                            href={`/product/${product._id || product.slug || ""}`}
                            onClick={() => {
                              saveRecentSearch(product.name);
                              setIsSearchFocused(false);
                            }}
                            className="flex items-center gap-2.5 p-3 hover:bg-skin-cream/60"
                          >
                            <img
                              src={img}
                              alt={product.name}
                              className="w-9 h-9 object-cover rounded bg-skin-sand"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-skin-charcoal truncate">
                                {product.name}
                              </p>
                              <span className="text-[10px] text-skin-charcoal/50">
                                Rs. {product.price}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {searchQuery.trim() && (
                    <button
                      onClick={() => executeSearch()}
                      className="w-full p-2.5 bg-skin-cream text-center font-medium text-skin-terracotta flex items-center justify-center gap-1 border-t border-skin-sand/30"
                    >
                      <span>View all results</span>
                      <FiArrowRight size={12} />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── LEVEL 3: PRIMARY NAVIGATION (DESKTOP) ── */}
          <div className="hidden lg:block border-t border-skin-sand/40">
            <nav
              aria-label="Main Navigation"
              className="max-w-7xl mx-auto px-8 flex items-center justify-center gap-8 py-2.5"
            >
              {navLinks.map((link) => {
                const active = isLinkActive(link);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative text-[11px] tracking-[0.2em] uppercase transition-colors py-1 group ${
                      active
                        ? "text-skin-terracotta font-bold"
                        : "text-skin-charcoal/70 hover:text-skin-charcoal font-medium"
                    }`}
                  >
                    <span>{link.name}</span>
                    {/* Active / Hover Thin Underline */}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-[1.5px] rounded-full transition-all duration-300 ${
                        active
                          ? "w-full bg-skin-terracotta"
                          : "w-0 group-hover:w-full bg-skin-terracotta/60"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* ── MOBILE SLIDE-OUT DRAWER ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-skin-charcoal/50 backdrop-blur-xs z-50 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-xs bg-white z-50 lg:hidden flex flex-col shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-skin-sand/50">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-skin-terracotta/10 flex items-center justify-center">
                    <HiSparkles size={13} className="text-skin-terracotta" />
                  </div>
                  <span className="text-base font-serif font-semibold tracking-[0.2em] text-skin-charcoal">
                    SKIN-AURA
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu drawer"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-skin-charcoal/60 hover:bg-skin-sand/50"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col px-5 py-5 gap-1.5 flex-1 overflow-y-auto">
                <span className="text-[10px] uppercase font-semibold text-skin-charcoal/40 tracking-[0.16em] px-3 pb-1">
                  Navigation
                </span>
                {navLinks.map((link) => {
                  const active = isLinkActive(link);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between py-2.5 px-3.5 rounded-xl text-xs tracking-wider uppercase font-medium transition-colors ${
                        active
                          ? "bg-skin-terracotta/10 text-skin-terracotta font-bold"
                          : "text-skin-charcoal/85 hover:bg-skin-sand/40"
                      }`}
                    >
                      <span>{link.name}</span>
                      {active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-skin-terracotta" />
                      )}
                    </Link>
                  );
                })}

                <div className="pt-3 mt-2 border-t border-skin-sand/40 space-y-1.5">
                  <span className="text-[10px] uppercase font-semibold text-skin-charcoal/40 tracking-[0.16em] px-3">
                    Services
                  </span>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setTrackOrderOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 py-2.5 px-3.5 rounded-xl text-xs tracking-wider uppercase text-skin-charcoal/85 hover:bg-skin-sand/40 text-left cursor-pointer font-medium"
                  >
                    <FiTruck size={14} className="text-skin-terracotta" />
                    <span>Track Order</span>
                  </button>

                  <Link
                    href="/product?sort=rating"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 py-2.5 px-3.5 rounded-xl text-xs tracking-wider uppercase text-skin-charcoal/85 hover:bg-skin-sand/40 font-medium"
                  >
                    <FiHeart size={14} className="text-skin-terracotta" />
                    <span>Wishlist & Favorites</span>
                  </Link>
                </div>
              </div>

              {/* Drawer Footer / Account */}
              <div className="p-5 border-t border-skin-sand/50 bg-skin-cream/20 space-y-2.5">
                {user ? (
                  <div className="bg-white rounded-xl p-3 border border-skin-sand/60 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full bg-skin-terracotta text-white text-xs font-bold flex items-center justify-center uppercase">
                        {user.name?.[0]}
                      </span>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-skin-charcoal truncate">
                          {user.name}
                        </p>
                        <p className="text-[10px] text-skin-charcoal/50 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-skin-sand/30 flex flex-col gap-1 text-xs">
                      <Link
                        href="/my-orders"
                        onClick={() => setIsOpen(false)}
                        className="py-1 flex items-center gap-2 text-skin-charcoal hover:text-skin-terracotta"
                      >
                        <FiPackage size={13} className="text-skin-terracotta" />
                        My Orders
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setIsOpen(false)}
                          className="py-1 flex items-center gap-2 text-skin-charcoal font-semibold hover:text-skin-sage"
                        >
                          <FiShield size={13} className="text-skin-sage" />
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setIsOpen(false);
                          logout();
                          router.push("/");
                        }}
                        className="py-1 flex items-center gap-2 text-red-500 text-left"
                      >
                        <FiLogOut size={13} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <button className="w-full py-2.5 rounded-xl border border-skin-charcoal text-skin-charcoal text-xs tracking-widest uppercase font-semibold hover:bg-skin-sand/40 transition-colors">
                      Sign In / Register
                    </button>
                  </Link>
                )}

                <Link href="/product" onClick={() => setIsOpen(false)}>
                  <button className="w-full py-2.5 rounded-xl bg-skin-charcoal text-white text-xs tracking-widest uppercase font-semibold hover:bg-skin-terracotta transition-colors shadow-sm">
                    Explore Skincare
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── TRACK ORDER MODAL ── */}
      <TrackOrderModal
        isOpen={trackOrderOpen}
        onClose={() => setTrackOrderOpen(false)}
      />
    </>
  );
}
