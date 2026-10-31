"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowRight,
  FiShield,
  FiDroplet,
  FiMoon,
} from "react-icons/fi";
import { HiOutlineSparkles, HiSparkles } from "react-icons/hi2";
import ProductCard from "./ProductCard";
import { skincareProducts } from "../api/skinData";
import api from "../lib/api";

const WINTER_TABS = [
  { id: "all", label: "All Winter Care", icon: "❄️" },
  { id: "cream", label: "Barrier & Creams", icon: "🛡️" },
  { id: "serum", label: "Hydration Serums", icon: "💧" },
  { id: "night", label: "Overnight Repair", icon: "🌙" },
  { id: "cleanser", label: "Gentle Cleansers", icon: "✨" },
];

const WINTER_PERKS = [
  {
    icon: <FiShield className="text-skin-terracotta" size={17} />,
    title: "Barrier Defense",
    desc: "Ceramides lock in lipids & repel cold dry air",
  },
  {
    icon: <FiDroplet className="text-skin-sage" size={17} />,
    title: "48H Hydration",
    desc: "Multi-weight Hyaluronic prevents seasonal flaking",
  },
  {
    icon: <HiSparkles className="text-amber-600" size={17} />,
    title: "Winter Glow",
    desc: "Cold-pressed rosehip & botanicals revive dullness",
  },
  {
    icon: <FiMoon className="text-indigo-500" size={17} />,
    title: "Overnight Repair",
    desc: "Restorative peptides reverse daytime wind stress",
  },
];

const WinterCollection = ({
  initialProducts = null,
  badge = "Winter Collection 2026",
  title = "Cold-Weather Skin Rescue",
  subtitle = "Shield and replenish your lipid moisture barrier against biting winds and indoor heating. Curated botanical ceramide balms, quenching serums, and gentle washes for continuous winter radiance.",
}) => {
  // Helper to filter winter products from a list
  const filterWinterProducts = (list) => {
    if (!Array.isArray(list)) return [];
    const winterKeywords = [
      "winter",
      "hydrat",
      "moistur",
      "barrier",
      "repair",
      "dry",
      "cream",
      "night",
    ];

    return list.filter((p) => {
      // Check explicit tags first
      if (
        Array.isArray(p.tags) &&
        p.tags.some((t) => t.toLowerCase() === "winter")
      ) {
        return true;
      }
      // Or check text matching winter profile
      const haystack = [
        p.name,
        p.category,
        p.subcategory,
        p.description,
        ...(p.tags || []),
        ...(p.skinType || []),
      ]
        .join(" ")
        .toLowerCase();
      return winterKeywords.some((kw) => haystack.includes(kw));
    });
  };

  const initialFiltered = filterWinterProducts(initialProducts);
  const [allProducts, setAllProducts] = useState(
    initialFiltered.length > 0
      ? initialFiltered
      : filterWinterProducts(skincareProducts)
  );
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(
    !initialProducts || initialFiltered.length === 0
  );

  useEffect(() => {
    // If server provided products and has winter items, use them
    const serverWinter = filterWinterProducts(initialProducts);
    if (serverWinter.length > 0) {
      setAllProducts(serverWinter);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchWinter = async () => {
      setLoading(true);
      try {
        // Query winter-tagged products from API
        const res = await api.get("/products?tag=winter&limit=16");
        const list = res.data?.products || res.data?.data;
        const validList = filterWinterProducts(list);

        if (isMounted && validList.length > 0) {
          setAllProducts(validList);
        } else {
          // Fallback to local catalog
          const fallback = filterWinterProducts(skincareProducts);
          if (isMounted) setAllProducts(fallback);
        }
      } catch (err) {
        console.warn("[WinterCollection] API fetch error, using fallback:", err?.message);
        const fallback = filterWinterProducts(skincareProducts);
        if (isMounted) setAllProducts(fallback);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchWinter();
    return () => {
      isMounted = false;
    };
  }, [initialProducts]);

  // Filter products by selected tab
  const displayedProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];
    if (activeTab === "all") return allProducts.slice(0, 8);

    if (activeTab === "cream") {
      return allProducts
        .filter(
          (p) =>
            p.category?.toLowerCase() === "cream" ||
            p.subcategory?.toLowerCase().includes("barrier") ||
            p.subcategory?.toLowerCase().includes("moistur")
        )
        .slice(0, 8);
    }

    if (activeTab === "serum") {
      return allProducts
        .filter(
          (p) =>
            p.category?.toLowerCase() === "serum" ||
            p.subcategory?.toLowerCase().includes("essence") ||
            p.subcategory?.toLowerCase().includes("oil")
        )
        .slice(0, 8);
    }

    if (activeTab === "night") {
      return allProducts
        .filter(
          (p) =>
            p.category?.toLowerCase().includes("night") ||
            p.name?.toLowerCase().includes("night") ||
            (Array.isArray(p.tags) &&
              p.tags.some((t) => t.toLowerCase().includes("night")))
        )
        .slice(0, 8);
    }

    if (activeTab === "cleanser") {
      return allProducts
        .filter(
          (p) =>
            p.category?.toLowerCase() === "facewash" ||
            p.category?.toLowerCase() === "gel wash" ||
            p.subcategory?.toLowerCase().includes("cleanse")
        )
        .slice(0, 8);
    }

    return allProducts.slice(0, 8);
  }, [allProducts, activeTab]);

  return (
    <section className="relative py-20 px-5 sm:px-8 md:px-12 lg:px-20 bg-gradient-to-b from-[#F3F7FA]/70 via-skin-cream to-skin-sand/30 border-t border-b border-sky-100/80 overflow-hidden">
      {/* Decorative Frost & Botanical Glow Circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-skin-terracotta/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-skin-sage/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-200 text-sky-800 text-[10px] font-bold uppercase tracking-[0.2em] shadow-xs">
              <span>❄️</span>
              <span>{badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-skin-charcoal font-medium leading-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-skin-charcoal/70 leading-relaxed font-light">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 self-start md:self-end">
            <Link
              href="/product?tag=winter"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-skin-charcoal text-white hover:bg-skin-terracotta text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 shadow-sm hover:shadow-md group"
            >
              <span>Explore Winter Edit</span>
              <FiArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
          </div>
        </div>

        {/* ── WINTER PERKS STRIP ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 pt-2">
          {WINTER_PERKS.map((perk, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-sky-100/60 shadow-xs hover:border-skin-terracotta/30 hover:bg-white transition-all duration-300 flex items-start gap-3 group"
            >
              <div className="p-2 rounded-lg bg-sky-50 group-hover:bg-skin-cream transition-colors duration-300 shrink-0">
                {perk.icon}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-skin-charcoal tracking-wide">
                  {perk.title}
                </h4>
                <p className="text-[11px] text-skin-charcoal/60 leading-snug font-light">
                  {perk.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── FILTER TABS ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-skin-sand/60">
          {WINTER_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium tracking-wider transition-all duration-300 whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-skin-terracotta text-white shadow-xs"
                    : "bg-white/80 text-skin-charcoal/70 hover:text-skin-charcoal hover:bg-white border border-skin-sand/60"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── FEATURED EDITORIAL HERO BANNER ── */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#21272A] via-[#2A3135] to-[#1E2326] text-white p-6 sm:p-8 md:p-10 shadow-lg border border-sky-900/30">
          <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-sky-400/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-sky-300 font-bold">
                <HiOutlineSparkles size={12} />
                Seasonal Ritual Guide
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-white font-medium">
                The 3-Step Cold Weather Barrier Lock
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                Cold air contracts blood vessels and strips ceramides. Cleanse with non-foaming lipids, mist with hydrating essence, and seal within 60 seconds with our restorative barrier balms.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-8">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-sky-300 font-bold">
                  Winter Gift Offer
                </p>
                <p className="text-xs text-white/90 font-medium">
                  Complimentary Moisture Recovery Balm
                </p>
                <p className="text-[11px] text-white/60">
                  Included automatically on winter orders over Rs. 3,500
                </p>
              </div>
              <Link
                href="/product?tag=winter"
                className="px-4 py-2.5 rounded-xl bg-white text-skin-charcoal hover:bg-skin-terracotta hover:text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 shrink-0"
              >
                Shop Routine
              </Link>
            </div>
          </div>
        </div>

        {/* ── LOADING SKELETON ── */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-sky-100 p-4 bg-white/70 space-y-4 animate-pulse"
              >
                <div className="h-56 bg-sky-100/50 rounded-xl w-full" />
                <div className="h-3 w-20 bg-sky-100/60 rounded" />
                <div className="h-5 w-3/4 bg-sky-100/60 rounded" />
                <div className="h-4 w-24 bg-sky-100/50 rounded" />
                <div className="h-9 w-full bg-sky-100/40 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* ── PRODUCT GRID WITH ANIMATION ── */}
        {!loading && displayedProducts.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 md:gap-6"
            >
              {displayedProducts.map((product, idx) => {
                const key = product._id || product.id || idx;
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % 4) * 0.06, duration: 0.3 }}
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
        {!loading && displayedProducts.length === 0 && (
          <div className="text-center py-16 px-4 rounded-2xl bg-white/60 border border-skin-sand/60 space-y-3">
            <span className="text-3xl">❄️</span>
            <h4 className="text-sm font-semibold text-skin-charcoal">
              No products found in this category
            </h4>
            <p className="text-xs text-skin-charcoal/60 max-w-md mx-auto">
              Try selecting another category tab or browse our complete botanical skincare catalog.
            </p>
            <button
              onClick={() => setActiveTab("all")}
              type="button"
              className="mt-2 px-4 py-2 rounded-full bg-skin-terracotta text-white text-xs font-semibold uppercase tracking-wider hover:bg-skin-charcoal transition-colors"
            >
              Show All Winter Products
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default WinterCollection;

