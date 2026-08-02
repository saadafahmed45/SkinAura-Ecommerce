"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "100%", label: "Natural Ingredients" },
  { value: "4.9★", label: "Average Rating" },
];

const HeroBanner = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/4041391/pexels-photo-4041391.jpeg')",
        }}
      />

      {/* Layered Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-skin-charcoal/85 via-skin-charcoal/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-skin-charcoal/60 via-transparent to-transparent" />

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-skin-terracotta/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-skin-sage/10 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 min-h-screen flex flex-col justify-center pt-24 pb-20">
        <div className="max-w-3xl">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 mb-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 px-5 py-2 rounded-full text-[11px] tracking-[0.2em] uppercase font-semibold"
          >
            <HiOutlineSparkles size={14} className="text-skin-sand" />
            Dermatologist Tested Formulas
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-white font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] mb-6"
          >
            Reveal Your
            <br />
            <span className="italic font-light text-skin-sand">
              Natural Radiance
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/75 text-base sm:text-lg md:text-xl mb-10 max-w-lg font-light leading-relaxed"
          >
            Crafted with pure botanicals and advanced scientific actives —
            gentle care designed for your skin's unique needs.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link href="/product">
              <button className="group flex items-center gap-3 px-8 py-4 text-[11px] tracking-[0.18em] uppercase text-white font-bold rounded-2xl bg-skin-terracotta hover:bg-skin-terracotta/90 transition-all duration-300 shadow-xl shadow-skin-terracotta/30 min-w-[170px] justify-center">
                Explore Shop
                <FiArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </button>
            </Link>
            <Link href="/about">
              <button className="flex items-center gap-3 px-8 py-4 text-[11px] tracking-[0.18em] uppercase text-white font-bold rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 transition-all duration-300 min-w-[170px] justify-center">
                Our Story
              </button>
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center gap-8 flex-wrap"
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-white font-serif text-2xl font-semibold leading-tight">
                  {stat.value}
                </span>
                <span className="text-white/55 text-[10px] uppercase tracking-widest mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Promo Pill (bottom right) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.9 }}
        className="absolute bottom-8 right-8 hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-5 py-3.5 rounded-2xl shadow-xl"
      >
        <span className="text-2xl">🎁</span>
        <div className="text-left">
          <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-skin-sand">
            First Purchase
          </p>
          <p className="text-xs font-semibold text-white">
            10% OFF · code{" "}
            <span className="bg-skin-terracotta/90 px-1.5 py-0.5 rounded-md text-[10px] font-bold ml-1">
              AURA10
            </span>
          </p>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2">
        <span className="text-white/40 text-[9px] uppercase tracking-[0.25em]">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
      </div>
    </div>
  );
};

export default HeroBanner;
