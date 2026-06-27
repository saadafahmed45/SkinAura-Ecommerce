"use client";
import React from "react";

const OfferMarquee = () => {
  const offers = [
    "✨ Free Shipping on orders over $50",
    "🧪 100% Dermatologist tested formulations",
    "🌱 Certified Cruelty-Free & Vegan",
    "🎁 Get a free hydrating mask on orders above $80",
    "⚡ Unlock 10% OFF your first purchase — Use code AURA10",
  ];

  return (
    <div className="bg-skin-sand border-y border-skin-sand/80 text-skin-charcoal py-3 overflow-hidden relative">
      <div className="animate-marquee whitespace-nowrap flex gap-12">
        {offers.concat(offers).map((offer, index) => (
          <span
            key={index}
            className="font-medium text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2"
          >
            {offer}
          </span>
        ))}
      </div>
    </div>
  );
};

export default OfferMarquee;
