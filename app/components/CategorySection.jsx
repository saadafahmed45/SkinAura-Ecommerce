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

import { categories as fallbackCategories } from "../api/categories";
import api from "../lib/api";

const CategorySection = ({
  title = "Shop by Category",
  subtitle = "Formulated solutions designed to address specific skin concerns and elevate your daily ritual.",
  badge = "Curated Collections",
}) => {
  const [categoryData, setCategoryData] = useState(fallbackCategories);

  useEffect(() => {
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
  }, []);

  return (
    <section className="px-5 sm:px-8 md:px-12 lg:px-20 py-20 bg-[#FAF7F2]/60 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header with Title + Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
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

          {/* Navigation Controls + Explore Link */}
          <div className="flex items-center gap-4 self-start md:self-end">
            <Link
              href="/product"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] font-bold text-skin-charcoal hover:text-skin-terracotta transition-colors group mr-2"
            >
              <span>Explore All</span>
              <FiArrowRight
                size={14}
                className="group-hover:translate-x-1.5 transition-transform duration-300"
              />
            </Link>

            {/* Swiper Arrow Buttons */}
            <div className="flex items-center gap-2">
              <button
                aria-label="Previous Category Slide"
                className="category-prev w-10 h-10 rounded-full border border-skin-sand/90 bg-white hover:bg-skin-terracotta hover:border-skin-terracotta hover:text-white text-skin-charcoal transition-all shadow-xs flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                aria-label="Next Category Slide"
                className="category-next w-10 h-10 rounded-full border border-skin-sand/90 bg-white hover:bg-skin-terracotta hover:border-skin-terracotta hover:text-white text-skin-charcoal transition-all shadow-xs flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* ── SWIPER CATEGORY SLIDER (4 CARDS PER VIEW ON DESKTOP) ── */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation={{
              prevEl: ".category-prev",
              nextEl: ".category-next",
            }}
            pagination={{
              clickable: true,
              el: ".category-pagination",
              bulletClass: "inline-block w-2 h-2 rounded-full bg-skin-charcoal/20 mx-1 cursor-pointer transition-all duration-300",
              bulletActiveClass: "!w-6 !bg-skin-terracotta",
            }}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={categoryData.length > 4}
            speed={700}
            breakpoints={{
              320: {
                slidesPerView: 1.2,
                spaceBetween: 14,
              },
              480: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 22,
              },
            }}
            className="w-full pb-10"
          >
            {categoryData.map((cat, idx) => {
              const key = cat._id || cat.id || idx;
              const name = cat.name;
              const description = cat.description;
              const image = cat.image;
              const targetUrl = `/product?category=${encodeURIComponent(name)}`;

              return (
                <SwiperSlide key={key} className="h-auto">
                  <div className="group relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden border border-skin-sand/50 bg-white shadow-xs hover:shadow-xl hover:border-skin-terracotta/40 transition-all duration-500 flex flex-col justify-end">
                    {/* Background Image */}
                    <img
                      src={image}
                      alt={name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      loading="lazy"
                    />

                    {/* Gradient Vignette for readable luxury text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-skin-charcoal/95 via-skin-charcoal/40 to-transparent transition-opacity duration-300" />

                    {/* Top Tag */}
                    <div className="absolute top-3.5 left-3.5 z-10">
                      <span className="backdrop-blur-md bg-white/85 text-skin-charcoal text-[9.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-white/50 shadow-xs">
                        Category
                      </span>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 p-4 sm:p-5 text-white space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xl sm:text-2xl font-serif font-medium tracking-wide">
                          {name}
                        </h3>
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-90 group-hover:bg-skin-terracotta group-hover:translate-x-1 transition-all duration-300 shrink-0">
                          <FiArrowRight size={13} />
                        </div>
                      </div>

                      {description && (
                        <p className="text-[11px] text-skin-sand/85 line-clamp-2 font-light leading-snug">
                          {description}
                        </p>
                      )}

                      <div className="pt-1.5">
                        <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] font-bold text-skin-sand group-hover:text-white transition-colors">
                          <span>Explore {name}</span>
                          <span className="w-3 h-px bg-skin-sand group-hover:w-6 group-hover:bg-white transition-all duration-300" />
                        </div>
                      </div>
                    </div>

                    {/* Full Card Link overlay */}
                    <Link
                      href={targetUrl}
                      aria-label={`View ${name} products`}
                      className="absolute inset-0 z-20"
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Dots Pagination */}
          <div className="category-pagination flex items-center justify-center pt-2" />
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
