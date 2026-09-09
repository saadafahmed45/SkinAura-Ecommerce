"use client";

import React from "react";
import Link from "next/link";
import { HiOutlineSparkles } from "react-icons/hi2";
import CategorySection from "../components/CategorySection";

const CategoryPage = () => {
  return (
    <div className="min-h-screen bg-skin-cream/20">
      {/* Category Page Hero */}
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
            <li className="text-white/70">Categories</li>
          </ol>

          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <HiOutlineSparkles size={16} className="text-skin-terracotta" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-skin-terracotta font-bold">
                  Skincare Collections
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-white leading-tight">
                Shop by{" "}
                <span className="italic font-light text-skin-sand">Category</span>
              </h1>
            </div>
            <p className="text-sm text-white/50 max-w-sm font-light">
              Select your targeted routine stage to filter through dermatologically formulated solutions.
            </p>
          </div>
        </div>
      </div>

      {/* Main Category Section */}
      <CategorySection
        title="Explore All Categories"
        subtitle="Click any category to filter and explore all tailored formulations in our catalog."
        badge="Targeted Skincare"
      />
    </div>
  );
};

export default CategoryPage;

