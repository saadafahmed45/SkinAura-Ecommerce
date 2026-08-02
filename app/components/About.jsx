"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const stats = [
  { value: "50K+", label: "Customers" },
  { value: "120+", label: "Products" },
  { value: "4.9", label: "Rating" },
  { value: "100%", label: "Natural" },
];

const About = () => {
  return (
    <section className="w-full py-24 bg-skin-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Image Side */}
          <div className="relative order-2 md:order-1">
            {/* Background decor */}
            <div className="absolute -top-6 -left-6 w-full h-full rounded-3xl bg-skin-sand/50 -z-10" />
            <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 rounded-3xl border border-skin-terracotta/20 -z-10" />

            <img
              src="https://images.pexels.com/photos/3762466/pexels-photo-3762466.jpeg"
              alt="Natural skincare ritual"
              className="rounded-3xl shadow-2xl w-full h-[480px] object-cover"
            />

            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 -right-4 md:-right-8 bg-white rounded-2xl shadow-xl px-6 py-5 border border-skin-sand/40">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="text-xl font-serif font-semibold text-skin-charcoal">
                      {s.value}
                    </p>
                    <p className="text-[9px] uppercase tracking-wider text-skin-charcoal/50 mt-0.5">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-7 order-1 md:order-2">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-skin-terracotta font-bold mb-4">
                <span className="w-8 h-px bg-skin-terracotta" />
                Our Story
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-skin-charcoal leading-[1.1]">
                Cultivating Your
                <br />
                <span className="italic font-light text-skin-sage">
                  Natural Skin Aura
                </span>
              </h2>
            </div>

            <p className="text-sm text-skin-charcoal/70 leading-relaxed font-light">
              At SkinAura, we believe skincare is more than a daily routine — it's a gentle ritual of self-care and confidence. Our mission is simple: to help you embrace and enhance your natural glow with clean, dermatologically-inspired products.
            </p>
            <p className="text-sm text-skin-charcoal/70 leading-relaxed font-light">
              Every skin type is unique. That's why we formulate targeted, high-performance skincare solutions crafted specifically for dry, oily, combination, and sensitive skin — merging nature's finest botanicals with clinical actives.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2">
              {["Dermatologist Tested", "Cruelty-Free", "100% Vegan", "Clean Formulas"].map((tag) => (
                <span
                  key={tag}
                  className="bg-skin-sand text-skin-charcoal text-[10px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-lg border border-skin-sand/60"
                >
                  {tag}
                </span>
              ))}
            </div>

            <Link href="/about">
              <button className="group flex items-center gap-3 px-7 py-3.5 border border-skin-charcoal text-skin-charcoal hover:bg-skin-charcoal hover:text-white text-[11px] uppercase tracking-[0.18em] font-bold rounded-2xl transition-all duration-300">
                Learn More
                <FiArrowRight
                  size={13}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
