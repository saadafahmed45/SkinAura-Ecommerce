"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { motion } from "framer-motion";

import { categories as fallbackCategories } from "../api/categories";
import api from "../lib/api";

const CategorySection = ({
  initialCategories = null,
  title = "Shop by Category",
  subtitle = "Formulated solutions designed to address specific skin concerns and elevate your daily ritual.",
  badge = "Curated Collections",
}) => {
  const [categoryData, setCategoryData] = useState(
    initialCategories && initialCategories.length > 0
      ? initialCategories
      : fallbackCategories
  );

  useEffect(() => {
    // If server provided categories, skip client-side fetch to save roundtrips
    if (initialCategories && initialCategories.length > 0) return;

    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        const cats = res.data?.categories || res.data?.data;
        if (isMounted && cats && cats.length > 0) {
          setCategoryData(cats);
        }
      } catch (err) {
        console.warn(
          "[CategorySection] Using fallback categories:",
          err?.message
        );
      }
    };

    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, [initialCategories]);

  return (
    <section className="px-5 sm:px-8 md:px-12 lg:px-20 py-16 md:py-20 bg-[#FAF7F2]/60 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Minimalist Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-skin-sand/60 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-skin-terracotta">
              <span className="w-5 h-px bg-skin-terracotta inline-block" />
              <span>{badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-skin-charcoal font-normal tracking-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-skin-charcoal/60 font-light max-w-lg leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Action Link */}
          <Link
            href="/product"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-bold text-skin-charcoal hover:text-skin-terracotta transition-colors group self-start md:self-end pb-0.5"
          >
            <span>Explore All</span>
            <FiArrowRight
              size={13}
              className="group-hover:translate-x-1.5 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* ── MINIMALIST 1-ROW CATEGORY STRIP ── */}
        <div className="w-full overflow-x-auto pb-4 pt-1 -mx-5 px-5 sm:-mx-8 sm:px-8 md:-mx-12 md:px-12 lg:mx-0 lg:px-0 lg:overflow-visible">
          <div
            className="grid gap-4 sm:gap-4.5 lg:gap-5 min-w-[850px] lg:min-w-0 w-full"
            style={{
              gridTemplateColumns: `repeat(${categoryData.length || 1}, minmax(0, 1fr))`,
            }}
          >
            {categoryData.map((cat, idx) => {
              const key = cat._id || cat.id || idx;
              const name = cat.name;
              const image = cat.image;
              const targetUrl = `/product?category=${encodeURIComponent(name)}`;

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.04, duration: 0.35 }}
                  className="h-full flex flex-col"
                >
                  <Link
                    href={targetUrl}
                    aria-label={`Shop ${name}`}
                    className="group flex flex-col h-full focus:outline-none"
                  >
                    {/* Clean Minimalist Image Frame */}
                    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-white border border-skin-sand/80 shadow-2xs group-hover:shadow-md group-hover:border-skin-terracotta/40 transition-all duration-500">
                      <img
                        src={
                          image ||
                          "https://images.pexels.com/photos/3762756/pexels-photo-3762756.jpeg"
                        }
                        alt={name}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.pexels.com/photos/3762756/pexels-photo-3762756.jpeg";
                        }}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                        loading="lazy"
                      />

                      {/* Subtle hover wash */}
                      <div className="absolute inset-0 bg-skin-charcoal/0 group-hover:bg-skin-charcoal/5 transition-colors duration-300" />
                    </div>

                    {/* Typography: Category Name + Minimalist Action */}
                    <div className="pt-3 text-center space-y-1">
                      <h3 className="font-serif text-base sm:text-[17px] text-skin-charcoal font-medium tracking-wide group-hover:text-skin-terracotta transition-colors leading-snug">
                        {name}
                      </h3>
                      <div className="inline-flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.18em] font-semibold text-skin-charcoal/45 group-hover:text-skin-terracotta transition-colors">
                        <span>Explore</span>
                        <FiArrowRight
                          size={11}
                          className="group-hover:translate-x-1 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {categoryData.length === 0 && (
          <div className="text-center py-16 text-skin-charcoal/50 text-sm">
            No categories available at this moment.
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
