"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const HeroBanner = () => {
  return (
    <div className="relative w-full h-[90vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-cover transition-transform duration-1000 scale-105"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/4041391/pexels-photo-4041391.jpeg')",
        }}
      ></div>

      {/* Elegant Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-skin-charcoal/80 via-skin-charcoal/45 to-skin-charcoal/80 flex flex-col justify-center items-center px-6 lg:px-20 text-center">
        {/* Animated Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4 bg-skin-terracotta/90 backdrop-blur-sm text-white px-5 py-1.5 rounded-full text-xs tracking-widest uppercase font-semibold shadow-lg"
        >
          ✨ Dermatologist Tested Formulas
        </motion.div>

        {/* Text Content */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 tracking-wide drop-shadow-md"
        >
          Reveal Your Skin's <br />
          <span className="italic font-light text-skin-sand">Natural Radiance</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-skin-sand/90 text-md sm:text-lg md:text-xl mb-10 max-w-xl font-light tracking-wide leading-relaxed"
        >
          Crafted with pure botanicals and advanced scientific actives. Gentle care designed for your skin's unique needs.
        </motion.p>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-5"
        >
          <Link href="/product">
            <button className="px-8 py-3.5 text-xs tracking-widest uppercase text-white font-semibold rounded-xl bg-skin-terracotta hover:bg-skin-sage transition-all duration-300 shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 min-w-[160px]">
              Explore Shop
            </button>
          </Link>
          <Link href="/about">
            <button className="px-8 py-3.5 text-xs tracking-widest uppercase text-skin-charcoal font-semibold rounded-xl bg-skin-cream hover:bg-skin-sand transition-all duration-300 shadow-md transform hover:-translate-y-0.5 active:translate-y-0 min-w-[160px]">
              Our Philosophy
            </button>
          </Link>
        </motion.div>

        {/* Promo Floating Badge */}
        <div className="absolute bottom-8 right-8 hidden md:flex items-center gap-2 bg-skin-cream/90 backdrop-blur-md border border-skin-sand text-skin-charcoal px-5 py-3 rounded-2xl shadow-xl animate-bounce">
          <span className="text-xl">🎁</span>
          <div className="text-left">
            <p className="text-[10px] uppercase tracking-widest font-bold text-skin-terracotta">First Purchase</p>
            <p className="text-xs font-semibold">10% OFF with code AURA10</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
