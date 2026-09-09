"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ProductCard from "./ProductCard";
import { skincareProducts } from "../api/skinData";
import api from "../lib/api";

const TopSellingProducts = ({
  badge = "Customer Favorites",
  title = "Top Selling Formulations",
  subtitle = "Our most-awarded botanical and clinical solutions, proven by glowing reviews and radiant results.",
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchTopSelling = async () => {
      setLoading(true);
      try {
        // Fetch top-selling products directly from the API (ordered with isTopSelling first)
        const res = await api.get("/products?sort=top-selling&limit=12");
        const list = res.data?.products || res.data?.data;
        if (isMounted && list && list.length > 0) {
          setProducts(list);
        } else {
          // Fallback if API returns empty list
          const fallbackSorted = [...skincareProducts].sort((a, b) => {
            if (Boolean(b.isTopSelling) !== Boolean(a.isTopSelling)) {
              return b.isTopSelling ? 1 : -1;
            }
            return (
              (b.sold || 0) - (a.sold || 0) || (b.rating || 0) - (a.rating || 0)
            );
          });
          if (isMounted) setProducts(fallbackSorted.slice(0, 12));
        }
      } catch (err) {
        console.warn(
          "[TopSellingProducts] API fetch error, using fallback:",
          err?.message,
        );
        const fallbackSorted = [...skincareProducts].sort((a, b) => {
          if (Boolean(b.isTopSelling) !== Boolean(a.isTopSelling)) {
            return b.isTopSelling ? 1 : -1;
          }
          return (
            (b.sold || 0) - (a.sold || 0) || (b.rating || 0) - (a.rating || 0)
          );
        });
        if (isMounted) setProducts(fallbackSorted.slice(0, 12));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTopSelling();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-20 px-5 sm:px-8 md:px-12 lg:px-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
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

          {/* Action Links & Swiper Controls */}
          <div className="flex items-center gap-4 self-start md:self-end">
            <Link
              href="/product?sort=rating"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] font-bold text-skin-charcoal hover:text-skin-terracotta transition-colors group mr-2"
            >
              <span>Explore All</span>
              <FiArrowRight
                size={14}
                className="group-hover:translate-x-1.5 transition-transform duration-300"
              />
            </Link>

            {/* Slider Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                aria-label="Previous Top Selling Slide"
                className="topselling-prev w-10 h-10 rounded-full border border-skin-sand/90 bg-white hover:bg-skin-terracotta hover:border-skin-terracotta hover:text-white text-skin-charcoal transition-all shadow-xs flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                aria-label="Next Top Selling Slide"
                className="topselling-next w-10 h-10 rounded-full border border-skin-sand/90 bg-white hover:bg-skin-terracotta hover:border-skin-terracotta hover:text-white text-skin-charcoal transition-all shadow-xs flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* ── LOADING SKELETON ── */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-skin-sand/40 p-4 bg-skin-cream/30 space-y-4 animate-pulse"
              >
                <div className="h-56 bg-skin-sand/50 rounded-xl w-full" />
                <div className="h-3 w-20 bg-skin-sand/60 rounded" />
                <div className="h-5 w-3/4 bg-skin-sand/60 rounded" />
                <div className="h-4 w-24 bg-skin-sand/50 rounded" />
                <div className="h-9 w-full bg-skin-sand/40 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* ── TOP SELLING PRODUCTS SWIPER SLIDER ── */}
        {!loading && products.length > 0 && (
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation={{
                prevEl: ".topselling-prev",
                nextEl: ".topselling-next",
              }}
              pagination={{
                clickable: true,
                el: ".topselling-pagination",
                bulletClass:
                  "inline-block w-2 h-2 rounded-full bg-skin-charcoal/20 mx-1 cursor-pointer transition-all duration-300",
                bulletActiveClass: "!w-6 !bg-skin-terracotta",
              }}
              autoplay={{
                delay: 1800,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={products.length > 4}
              speed={750}
              breakpoints={{
                320: {
                  slidesPerView: 1.25,
                  spaceBetween: 14,
                },
                540: {
                  slidesPerView: 2,
                  spaceBetween: 16,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 24,
                },
              }}
              className="w-full pb-10"
            >
              {products.map((product, idx) => {
                const key = product._id || product.id || idx;
                return (
                  <SwiperSlide key={key} className="h-auto">
                    <div className="h-full flex flex-col">
                      <ProductCard product={product} />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* Dots Pagination */}
            <div className="topselling-pagination flex items-center justify-center pt-2" />
          </div>
        )}
      </div>
    </section>
  );
};

export default TopSellingProducts;
