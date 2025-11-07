"use client";
import React from "react";
import Link from "next/link";

const HeroBanner = () => {
  return (
    <div className="relative w-full h-[90vh] lg:h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-cover transition-transform duration-1000 hover:scale-105"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/19599222/pexels-photo-19599222.jpeg')",
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70 flex flex-col justify-center items-center px-6 lg:px-20">
        {/* Text Content */}
        <h1 className="text-white font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center mb-6 drop-shadow-lg">
          Comfort Meets Style
        </h1>
        <p className="text-gray-200 text-lg sm:text-xl md:text-2xl text-center mb-8 max-w-2xl drop-shadow-md">
          Discover our premium collection and elevate your everyday lifestyle.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/product">
            <button className="px-8 py-3 text-white font-semibold rounded-md bg-blue-600 hover:bg-blue-500 transition-all duration-300 shadow-lg transform hover:scale-105">
              Shop Now
            </button>
          </Link>
          <Link href="/">
            <button className="px-8 py-3 text-blue-600 font-semibold rounded-md bg-white hover:bg-gray-100 transition-all duration-300 shadow-md transform hover:scale-105">
              View Offers
            </button>
          </Link>
        </div>

        {/* Optional Promo Badge */}
        <div className="absolute bottom-8 right-8 bg-gradient-to-r from-yellow-400 to-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-bounce">
          🔥 Up to 50% OFF Today!
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
