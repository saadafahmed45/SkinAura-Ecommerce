"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { HiOutlineSparkles, HiSparkles } from "react-icons/hi2";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Keyboard } from "swiper/modules";

// Swiper core styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "100%", label: "Natural Ingredients" },
  { value: "4.9★", label: "Average Rating" },
];

const slides = [
  {
    id: 1,
    badge: "Dermatologist Formulated · 100% Organic",
    headline: "Reveal Your",
    accent: "Natural Radiance",
    sub: "Crafted with pure botanicals and bio-active scientific actives — gentle, clinically backed care designed for your skin's unique harmony.",
    bg: "https://images.pexels.com/photos/3762756/pexels-photo-3762756.jpeg",
    primaryCta: { label: "Explore Shop", href: "/product" },
    secondaryCta: { label: "Our Story", href: "/about" },
    tag: "Clean · Cruelty Free · Vegan",
  },
  {
    id: 2,
    badge: "New Season · Botanical Complex",
    headline: "Glow From",
    accent: "Deep Within",
    sub: "Our vitamin-rich serums infuse multi-depth hydration and reinforce your skin barrier for an effortless, lit-from-within luminosity.",
    bg: "https://images.pexels.com/photos/3985360/pexels-photo-3985360.jpeg",
    primaryCta: { label: "Discover Serums", href: "/product" },
    secondaryCta: { label: "Skin Guide", href: "/about" },
    tag: "Hyaluronic + Vitamin C Active",
  },
  {
    id: 3,
    badge: "SPF 50+ · Invisible Everyday Defense",
    headline: "Protect Your",
    accent: "Everyday Glow",
    sub: "Featherlight, non-greasy shield guarding against UV damage and urban pollutants while leaving your complexion velvety soft.",
    bg: "https://images.pexels.com/photos/3736398/pexels-photo-3736398.jpeg",
    primaryCta: { label: "Shop Sun Protection", href: "/product" },
    secondaryCta: { label: "Learn More", href: "/about" },
    tag: "Zero White Cast · Matte Finish",
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

  const activeSlide = slides[activeIndex] || slides[0];

  return (
    <section
      className="relative w-full min-h-[640px] md:h-[90vh] lg:h-[92vh] max-h-[960px] overflow-hidden bg-skin-charcoal"
      aria-label="Hero Carousel"
    >
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Keyboard]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        speed={1000}
        keyboard={{ enabled: true }}
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full h-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={slide.id || i}>
            <div className="relative w-full h-full min-h-[640px] md:min-h-full">
              {/* Background Image with subtle Ken Burns zoom */}
              <div
                className={`absolute inset-0 bg-center bg-cover transition-transform duration-1000 ease-out ${
                  activeIndex === i ? "scale-105" : "scale-100"
                }`}
                style={{ backgroundImage: `url('${slide.bg}')` }}
              />

              {/* Multi-layered Cinematic Gradients for high contrast & luxury aesthetic */}
              <div className="absolute inset-0 bg-gradient-to-r from-skin-charcoal/95 via-skin-charcoal/75 to-skin-charcoal/40 md:to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-skin-charcoal/90 via-transparent to-skin-charcoal/30" />

              {/* Decorative Glow Orbs */}
              <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-skin-terracotta/15 blur-3xl pointer-events-none" />
              <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-skin-sage/15 blur-3xl pointer-events-none" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Floating Animated Slide Content Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col justify-center pt-16 md:pt-20 pb-24 md:pb-20">
          <div className="max-w-3xl pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Badge & Tag */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/95 px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-semibold shadow-sm">
                    <HiOutlineSparkles size={14} className="text-skin-sand animate-pulse" />
                    {activeSlide.badge}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-skin-sand/80 text-[11px] tracking-wider uppercase">
                    <HiSparkles size={11} className="text-skin-terracotta" />
                    {activeSlide.tag}
                  </span>
                </div>

                {/* Editorial Headline */}
                <h1 className="text-white font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.08] mb-5 sm:mb-6 tracking-tight">
                  {activeSlide.headline}{" "}
                  <br />
                  <span className="italic font-light text-skin-sand">
                    {activeSlide.accent}
                  </span>
                </h1>

                {/* Description Copy */}
                <p className="text-white/80 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-xl font-light leading-relaxed">
                  {activeSlide.sub}
                </p>

                {/* CTA Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 sm:mb-14 pointer-events-auto">
                  <Link href={activeSlide.primaryCta.href}>
                    <button className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-white font-bold rounded-2xl bg-skin-terracotta hover:bg-skin-terracotta/90 active:scale-[0.98] transition-all duration-300 shadow-xl shadow-skin-terracotta/30 min-w-[170px] cursor-pointer">
                      {activeSlide.primaryCta.label}
                      <FiArrowRight
                        size={15}
                        className="group-hover:translate-x-1.5 transition-transform duration-300"
                      />
                    </button>
                  </Link>
                  <Link href={activeSlide.secondaryCta.href}>
                    <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-white font-bold rounded-2xl bg-white/10 hover:bg-white/20 active:scale-[0.98] backdrop-blur-md border border-white/25 transition-all duration-300 min-w-[170px] cursor-pointer">
                      {activeSlide.secondaryCta.label}
                    </button>
                  </Link>
                </div>

                {/* Trust Stats Bar */}
                <div className="flex items-center gap-6 sm:gap-10 border-t border-white/10 pt-6 max-w-lg">
                  {stats.map((stat, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-white font-serif text-xl sm:text-2xl font-bold leading-tight">
                        {stat.value}
                      </span>
                      <span className="text-white/60 text-[9px] sm:text-[10px] uppercase tracking-widest mt-0.5">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Floating First Purchase Promo Pill (bottom right desktop) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="absolute bottom-8 right-6 md:right-10 z-20 hidden md:flex items-center gap-3 bg-skin-charcoal/60 backdrop-blur-xl border border-white/20 text-white px-5 py-3.5 rounded-2xl shadow-2xl hover:border-skin-terracotta/50 transition-colors"
      >
        <span className="text-2xl select-none">🎁</span>
        <div className="text-left">
          <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-skin-sand">
            First Purchase
          </p>
          <p className="text-xs font-semibold text-white">
            10% OFF · code{" "}
            <span className="bg-skin-terracotta text-white px-1.5 py-0.5 rounded-md text-[10px] font-bold ml-1 tracking-wider">
              AURA10
            </span>
          </p>
        </div>
      </motion.div>

      {/* Custom Slider Navigation Controls (Arrow Buttons + Dots + Counter) */}
      <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-12 z-20 flex items-center gap-3 sm:gap-4 pointer-events-auto">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous slide"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-skin-terracotta active:scale-95 backdrop-blur-md border border-white/20 hover:border-skin-terracotta text-white flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer"
        >
          <FiArrowLeft size={16} />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          aria-label="Next slide"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-skin-terracotta active:scale-95 backdrop-blur-md border border-white/20 hover:border-skin-terracotta text-white flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer"
        >
          <FiArrowRight size={16} />
        </button>

        {/* Slide Pagination Dots / Progress Bars */}
        <div className="flex items-center gap-2 pl-2" role="tablist" aria-label="Slides navigation">
          {slides.map((_, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={idx}
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => handleGoToSlide(idx)}
                className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                  isActive
                    ? "w-8 bg-skin-terracotta shadow-md shadow-skin-terracotta/50"
                    : "w-2.5 bg-white/35 hover:bg-white/70"
                }`}
              />
            );
          })}
        </div>

        {/* Slide Counter (01 / 03) */}
        <div className="hidden sm:flex items-center text-white/50 text-xs font-mono tracking-widest pl-2">
          <span className="text-white font-semibold">
            0{activeIndex + 1}
          </span>
          <span className="mx-1 text-white/30">/</span>
          <span>0{slides.length}</span>
        </div>
      </div>

      {/* Subtle Scroll Hint Indicator (Desktop Center) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden lg:flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-white/40 text-[9px] uppercase tracking-[0.25em]">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
      </div>
    </section>
  );
};

export default HeroBanner;
