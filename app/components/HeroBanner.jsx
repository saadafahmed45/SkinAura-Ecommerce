"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Keyboard } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

// Trust Badge SVGs matching the user's reference design
const BadgeIcon = ({ type }) => {
  switch (type) {
    case "leaf":
      return (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-[#C5747F]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6" />
        </svg>
      );
    case "bunny":
      return (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-[#C5747F]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 3.5C8 2 6 2 5 3.5s1 4.5 2 6" />
          <path d="M12 3.5C13 2 15 2 16 3.5s-1 4.5-2 6" />
          <path d="M7 11.5c-2.5 1.5-3 4.5-2 7 1.2 3 5 3.5 7 3.5 3 0 6.5-1.5 7-4.5.5-3-1.5-5.5-4.5-6" />
          <circle cx="8.5" cy="14" r="0.75" fill="currentColor" />
          <circle cx="15.5" cy="14" r="0.75" fill="currentColor" />
          <path d="M11.5 16.5c.3.3.7.3 1 0" />
        </svg>
      );
    case "flask":
      return (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-[#C5747F]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 2v5.5L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 7.5V2" />
          <path d="M8.5 2h7" />
          <path d="M7.5 16h9" />
          <circle cx="10" cy="13" r="0.75" fill="currentColor" />
          <circle cx="13.5" cy="14.5" r="0.75" fill="currentColor" />
        </svg>
      );
    case "drop":
      return (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-[#C5747F]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2.7l5.66 5.66a8 8 0 1 1-11.31 0z" />
          <path d="M12 11.5a3 3 0 0 1 3 3" />
        </svg>
      );
    case "skin":
      return (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-[#C5747F]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.2 4.8 2.2 6.3.8 1.2 1.8 2.7 1.8 4.7h6c0-2 1-3.5 1.8-4.7 1-1.5 2.2-3.8 2.2-6.3a7 7 0 0 0-7-7Z" />
          <path d="M9 10h.01" />
          <path d="M15 10h.01" />
          <path d="M10.5 13.5a2.5 2.5 0 0 0 3 0" />
        </svg>
      );
    case "shield":
      return (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-[#C5747F]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    default:
      return null;
  }
};

const slides = [
  {
    id: 1,
    tag: null, // Image 1 has no tag above title
    headlineLine1: "Reveal Your",
    headlineLine2: "Natural Beauty",
    description:
      "Premium cosmetics crafted with natural ingredients for healthy, glowing skin.",
    primaryCta: { label: "SHOP NOW", href: "/product" },
    secondaryCta: null,
    image: "/hero/hero-slide-1.jpg",
    alt: "Aura Skincare luxury cosmetics set with gentle cleanser, rose water toner, luminous moisture cream and bloom serum on stone pedestal",
    trustBadges: [
      {
        type: "leaf",
        line1: "NATURAL",
        line2: "INGREDIENTS",
      },
      {
        type: "bunny",
        line1: "CRUELTY",
        line2: "FREE",
      },
      {
        type: "flask",
        line1: "PARABEN",
        line2: "FREE",
      },
    ],
  },
  {
    id: 2,
    tag: "NEW ARRIVAL",
    headlineLine1: "Glow Naturally.",
    headlineLine2: "Shine Confidently.",
    description:
      "Skincare and beauty essentials that bring out your natural radiance.",
    primaryCta: { label: "SHOP NOW", href: "/product" },
    secondaryCta: { label: "EXPLORE COLLECTION", href: "/product?sort=newest" },
    image: "/hero/hero-slide-2.jpg",
    alt: "Smiling woman with radiant dewy skin touching cheek next to Aura Skincare Radiance Boost serum on travertine pedestal",
    trustBadges: [
      {
        type: "leaf",
        line1: "Clean",
        line2: "Ingredients",
      },
      {
        type: "bunny",
        line1: "Cruelty",
        line2: "Free",
      },
      {
        type: "drop",
        line1: "Dermatologist",
        line2: "Tested",
      },
      {
        type: "skin",
        line1: "For All",
        line2: "Skin Types",
      },
    ],
  },
  {
    id: 3,
    tag: "ORGANIC FORMULA",
    headlineLine1: "Nourish Deeply.",
    headlineLine2: "Bloom Gracefully.",
    description:
      "Restorative botanical face oils and velvety hydrating creams designed to replenish and strengthen your barrier.",
    primaryCta: { label: "SHOP NOW", href: "/product" },
    secondaryCta: { label: "VIEW ROUTINE", href: "/category" },
    image: "/hero/hero-slide-3.jpg",
    alt: "Aura Skincare restorative face oil and hydrating creme jar on textured travertine stone with eucalyptus and rose petals",
    trustBadges: [
      {
        type: "leaf",
        line1: "100% Organic",
        line2: "Botanicals",
      },
      {
        type: "drop",
        line1: "Deep Moisture",
        line2: "Hydration",
      },
      {
        type: "bunny",
        line1: "Cruelty",
        line2: "Free",
      },
      {
        type: "shield",
        line1: "Skin Barrier",
        line2: "Defense",
      },
    ],
  },
];

const HeroBanner = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  const handleGoToSlide = (index) => {
    if (swiperInstance) {
      swiperInstance.slideToLoop(index);
    }
  };

  const currentSlide = slides[activeIndex] || slides[0];

  return (
    <section
      id="hero-banner"
      className="relative w-full overflow-hidden bg-[#FBF7F4] select-none"
      aria-label="Hero Banner Slider"
    >
      {/* ── Background & Visual Swiper Slider ── */}
      <div className="relative w-full h-[580px] sm:h-[620px] md:h-[660px] lg:h-[720px] xl:h-[760px]">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Keyboard]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={true}
          speed={900}
          keyboard={{ enabled: true }}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          onSwiper={setSwiperInstance}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="w-full h-full"
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={slide.id || i}>
              <div className="relative w-full h-full">
                {/* Visual Image with gentle zoom effect */}
                <div
                  className={`absolute inset-0 bg-cover bg-no-repeat transition-transform duration-1000 ease-out ${
                    activeIndex === i ? "scale-[1.03]" : "scale-100"
                  }`}
                  style={{
                    backgroundImage: `url('${slide.image}')`,
                    backgroundPosition: "right 20% center",
                  }}
                  role="img"
                  aria-label={slide.alt}
                />

                {/* Soft Studio Ambient Gradient:
                    Blends from warm solid ivory/cream on the left (text area)
                    into translucent blush/cream, revealing product photography on right.
                    On small mobile screens, protects legibility across the entire width. */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F3] via-[#FAF6F3]/95 via-55% sm:via-45% md:via-50% to-[#FAF6F3]/50 md:to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6F3] via-transparent to-transparent md:hidden" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ── Foreground Animated Content Layer ── */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 h-full flex flex-col justify-center pt-8 sm:pt-0 pb-16 sm:pb-0">
            <div className="max-w-xl lg:max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-auto"
                >
                  {/* Optional Top Tag / Badge (e.g., "NEW ARRIVAL") */}
                  {currentSlide.tag && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                      className="mb-3 sm:mb-4"
                    >
                      <span className="text-[#C5747F] text-xs sm:text-[13px] font-semibold tracking-[0.22em] uppercase inline-block">
                        {currentSlide.tag}
                      </span>
                    </motion.div>
                  )}

                  {/* Main Editorial Serif Headline */}
                  <h1 className="font-serif text-[#22201E] text-4xl sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[74px] font-normal leading-[1.08] tracking-tight mb-4 sm:mb-5">
                    <span className="block">{currentSlide.headlineLine1}</span>
                    <span className="block">{currentSlide.headlineLine2}</span>
                  </h1>

                  {/* Subtitle / Description Copy */}
                  <p className="text-[#5E5751] text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-md sm:max-w-lg mb-7 sm:mb-9">
                    {currentSlide.description}
                  </p>

                  {/* Call-To-Action Buttons */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
                    {/* Primary Button: "SHOP NOW" in dusty rose pill shape */}
                    <Link
                      href={currentSlide.primaryCta.href}
                      className="inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[#C5747F] hover:bg-[#B5636E] text-white text-xs sm:text-[13px] font-semibold tracking-[0.18em] uppercase shadow-md shadow-[#C5747F]/25 hover:shadow-lg hover:shadow-[#C5747F]/35 active:scale-[0.98] transition-all duration-300"
                    >
                      {currentSlide.primaryCta.label}
                    </Link>

                    {/* Secondary Button / Text Link (Image 2 style: "EXPLORE COLLECTION ->") */}
                    {currentSlide.secondaryCta && (
                      <Link
                        href={currentSlide.secondaryCta.href}
                        className="group inline-flex items-center gap-2 text-xs sm:text-[13px] font-bold tracking-[0.18em] uppercase text-[#23201D] hover:text-[#C5747F] transition-colors py-2"
                      >
                        <span>{currentSlide.secondaryCta.label}</span>
                        <FiArrowRight
                          size={15}
                          className="group-hover:translate-x-1.5 transition-transform duration-300"
                        />
                      </Link>
                    )}
                  </div>

                  {/* Trust Badges Bar (Leaf, Bunny, Paraben / Drop / Skin) */}
                  <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 pt-2 sm:pt-4">
                    {currentSlide.trustBadges.map((badge, idx) => (
                      <React.Fragment key={idx}>
                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5">
                          <div className="flex items-center justify-center">
                            <BadgeIcon type={badge.type} />
                          </div>
                          <div className="text-[10px] sm:text-[11px] font-semibold text-[#4A4540] tracking-wider uppercase leading-tight">
                            <span>{badge.line1}</span>
                            {badge.line2 && (
                              <span className="block">{badge.line2}</span>
                            )}
                          </div>
                        </div>

                        {/* Subtle divider line between badges (shown like in image 2) */}
                        {idx < currentSlide.trustBadges.length - 1 && (
                          <div
                            className="hidden sm:block h-7 w-px bg-[#E5DDD5]"
                            aria-hidden="true"
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Slide Navigation Controls (Bottom Right - Exactly as in user image 2) ── */}
        <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-12 z-20 flex items-center gap-2 sm:gap-3 pointer-events-auto">
          {/* Slide Indicator ("1 / 3") */}
          <div className="text-xs sm:text-[13px] font-medium text-[#4A4540] tracking-widest select-none mr-1 sm:mr-2">
            <span>{activeIndex + 1}</span>
            <span className="mx-1 text-[#8C837A]">/</span>
            <span className="text-[#8C837A]">{slides.length}</span>
          </div>

          {/* Previous Slide Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous slide"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 hover:bg-[#C5747F] text-[#3A3530] hover:text-white border border-[#E8E0D7] shadow-sm flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <FiChevronLeft size={16} />
          </button>

          {/* Next Slide Button */}
          <button
            onClick={handleNext}
            aria-label="Next slide"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 hover:bg-[#C5747F] text-[#3A3530] hover:text-white border border-[#E8E0D7] shadow-sm flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <FiChevronRight size={16} />
          </button>
        </div>

        {/* ── Subtle Slide Dots for Quick Tap (Bottom Left) ── */}
        <div
          className="absolute bottom-6 sm:bottom-8 left-6 sm:left-14 z-20 hidden md:flex items-center gap-2 pointer-events-auto"
          role="tablist"
          aria-label="Slide indicators"
        >
          {slides.map((_, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={idx}
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => handleGoToSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                  isActive
                    ? "w-7 bg-[#C5747F] shadow-sm"
                    : "w-2 bg-[#D9CEC4] hover:bg-[#C5747F]/60"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
