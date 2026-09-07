"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import FeaturePDCard from "./FeaturePDCard";
import { skincareProducts } from "../api/skinData";
import { FiArrowRight } from "react-icons/fi";
import api from "../lib/api";

const FeatureProducts = ({ categoryName }) => {
  const fallback = skincareProducts?.filter(
    (item) => item.category?.toLowerCase() === categoryName?.toLowerCase()
  ) || [];

  const [products, setProducts] = useState(fallback.slice(0, 4));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCategoryProducts = async () => {
      try {
        const res = await api.get(`/products?category=${encodeURIComponent(categoryName)}&limit=4`);
        if (isMounted && res.data?.data && res.data.data.length > 0) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.warn(`[FeatureProducts] Failed to fetch ${categoryName}, using fallback:`, err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategoryProducts();
    return () => {
      isMounted = false;
    };
  }, [categoryName]);

  return (
    <section className="py-20 px-6 md:px-12 lg:px-20 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-skin-terracotta font-bold flex items-center gap-2">
              <span className="w-6 h-px bg-skin-terracotta inline-block" />
              Curated for You
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-skin-charcoal leading-tight">
              {categoryName}
              <span className="italic font-light text-skin-charcoal/60 ml-3">
                Collection
              </span>
            </h2>
            <p className="text-sm text-skin-charcoal/55 font-light max-w-sm">
              Discover our best-selling {categoryName?.toLowerCase()} formulations, crafted with premium botanical actives.
            </p>
          </div>

          <Link href={`/category/${encodeURIComponent(categoryName)}`}>
            <motion.button
              whileHover={{ x: 4 }}
              className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-bold text-skin-charcoal hover:text-skin-terracotta transition-colors duration-300 group"
            >
              View All
              <FiArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </motion.button>
          </Link>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-skin-sand via-skin-terracotta/20 to-transparent mb-12" />

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {products.slice(0, 4).map((product, i) => (
            <motion.div
              key={product._id || product.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <FeaturePDCard product={product} />
            </motion.div>
          ))}

          {products.length === 0 && !loading && (
            <div className="col-span-full text-center text-skin-charcoal/40 text-sm py-16">
              No products found in {categoryName}.
            </div>
          )}
        </div>

        {/* Mobile See More */}
        <div className="flex justify-center mt-10 md:hidden">
          <Link href={`/category/${encodeURIComponent(categoryName)}`}>
            <button className="flex items-center gap-2.5 px-7 py-3.5 border border-skin-charcoal text-skin-charcoal rounded-2xl text-xs uppercase tracking-widest font-bold hover:bg-skin-charcoal hover:text-white transition-all duration-300">
              View All {categoryName}
              <FiArrowRight size={12} />
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeatureProducts;
