"use client";
import React from "react";
import { HiSparkles } from "react-icons/hi2";

const offers = [
  "✦ Free Shipping on orders over Rs. 5000",
  "✦ 100% Dermatologist Tested Formulations",
  "✦ Certified Cruelty-Free & Vegan",
  "✦ Free Hydrating Mask on orders above Rs. 8000",
  "✦ 10% OFF First Purchase — Code: AURA10",
  "✦ Same Day Dispatch on Orders Before 3 PM",
];

const OfferMarquee = () => {
  return (
    <div className="relative bg-skin-charcoal border-y border-white/5 py-3.5 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex gap-0">
        {offers.concat(offers).map((offer, index) => (
          <span
            key={index}
            className="text-[11px] uppercase tracking-[0.18em] text-white/70 font-medium px-8 flex items-center gap-2 shrink-0"
          >
            <HiSparkles size={10} className="text-skin-terracotta shrink-0" />
            {offer}
          </span>
        ))}
      </div>

      {/* Fade Edges */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-skin-charcoal to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-skin-charcoal to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default OfferMarquee;
