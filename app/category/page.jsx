"use client";

import Link from "next/link";
import React from "react";
import { categories } from "../api/categories";

const Category = () => {
  const catagoryData = categories;

  return (
    <div className="px-6 md:px-12 lg:px-20 py-20 bg-skin-cream/10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Title */}
        <div className="text-center space-y-2 max-w-lg mx-auto">
          <span className="text-xs uppercase tracking-widest text-skin-terracotta font-bold">Discover</span>
          <h2 className="text-3xl md:text-5xl font-serif text-skin-charcoal font-medium">
            Shop by Category
          </h2>
          <p className="text-sm text-skin-charcoal/60 leading-relaxed font-light">
            Formulated solutions designed to address specific concerns and elevate your daily skincare routine.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {catagoryData.slice(0, 4).map(({ id, name, description, image }) => (
            <Link key={id} href={`/category/${name}`}>
              <div className="group relative cursor-pointer overflow-hidden rounded-2xl border border-skin-sand/35 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                {/* Image Container */}
                <div className="w-full h-80 overflow-hidden relative">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-skin-charcoal/60 via-transparent to-transparent opacity-80"></div>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-5 text-white flex flex-col justify-end">
                  <h3 className="text-xl font-serif tracking-wide font-medium">{name}</h3>
                  <p className="text-[10px] text-skin-sand/80 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
