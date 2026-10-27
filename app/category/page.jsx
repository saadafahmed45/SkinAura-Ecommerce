import React from "react";
import Link from "next/link";
import { HiOutlineSparkles } from "react-icons/hi2";
import CategorySection from "../components/CategorySection";
import { getCategories } from "../lib/api/categories";

export const revalidate = 3600; // Cache categories page for 1 hour

export const metadata = {
  title: "Skincare Categories | SkinAura",
  description:
    "Explore dermatologically formulated botanical solutions curated by skin concern and routine stage.",
};

export default async function CategoryPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-skin-cream/20">
      {/* Category Page Hero */}
      <div className="bg-[#FAF7F2] border-b border-skin-sand/60 pt-28 pb-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-5">
          {/* Breadcrumb */}
          <ol className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-skin-charcoal/45">
            <li>
              <Link href="/" className="hover:text-skin-terracotta transition-colors">
                Home
              </Link>
            </li>
            <span className="text-skin-charcoal/25">/</span>
            <li className="text-skin-charcoal font-semibold">Categories</li>
          </ol>

          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-px bg-skin-terracotta inline-block" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-skin-terracotta font-bold">
                  Skincare Collections
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-skin-charcoal font-normal tracking-tight">
                Shop by{" "}
                <span className="italic font-light text-skin-charcoal/60">Category</span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-skin-charcoal/60 max-w-sm font-light leading-relaxed">
              Select your targeted routine stage to filter through dermatologically formulated solutions.
            </p>
          </div>
        </div>
      </div>

      {/* Main Category Section */}
      <CategorySection
        initialCategories={categories}
        title="Explore All Categories"
        subtitle="Click any category to filter and explore all tailored formulations in our catalog."
        badge="Targeted Skincare"
      />
    </div>
  );
}
