"use client";
import React from "react";
import Link from "next/link";
import FeaturePDCard from "./FeaturePDCard";
import { skincareProducts } from "../api/skinData";

const FeatureProducts = ({ categoryName }) => {
  const products = skincareProducts?.filter(
    (item) => item.category === categoryName
  );

  return (
    <div className="mx-auto px-6 md:px-16 py-16">
      {/* Section Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 text-center md:text-left">
        {categoryName} Collection
      </h2>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.slice(0, 4).map((product) => (
          <FeaturePDCard
            key={product.id}
            {...product}
            className="transition-transform hover:scale-105 hover:shadow-xl"
          />
        ))}

        {products.length === 0 && (
          <div className="col-span-full text-center text-gray-400 text-lg py-10">
            No products found in {categoryName}.
          </div>
        )}
      </div>

      {/* See More Button */}
      <div className="text-center mt-12">
        <Link href={`/category/${categoryName}`}>
          <button className="bg-slate-900 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all duration-300">
            See More
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FeatureProducts;
