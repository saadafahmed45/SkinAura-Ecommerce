"use client";
import React from "react";

const OfferMarquee = () => {
  // Example offers
  const offers = [
    "🔥 Flat 50% OFF on Electronics!",
    "💥 Buy 1 Get 1 Free on Shoes!",
    "🎁 Free Shipping on Orders over $50!",
    "✨ Up to 70% OFF on Summer Collection!",
    "⚡ Limited Time Deal: Extra 10% OFF on All Products!",
  ];

  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-3 overflow-hidden relative">
      <div className="animate-marquee whitespace-nowrap flex gap-12">
        {offers.concat(offers).map((offer, index) => (
          <span
            key={index}
            className="font-semibold text-sm sm:text-lg md:text-xl uppercase tracking-wide"
          >
            {offer}
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused; /* Pause on hover */
        }
      `}</style>
    </div>
  );
};

export default OfferMarquee;
