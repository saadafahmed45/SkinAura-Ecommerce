"use client";

import { skincareProducts } from "@/app/api/skinData";
import ProductCard from "@/app/components/ProductCard";
import Link from "next/link";
import React from "react";

const CategoryPage = ({ params }) => {
  const { id } = React.use(params); // Category Name e.g. "Serum" or "Cream"

  // FILTER PRODUCTS BY CATEGORY NAME
  const products = skincareProducts?.filter((item) => item.category === id);

  return (
    <div className="px-6 md:px-12 lg:px-20 py-28 mx-auto bg-skin-cream/10 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-3 max-w-lg mx-auto mb-16">
        <span className="text-xs uppercase tracking-widest text-skin-terracotta font-bold">Category Collection</span>
        <h2 className="text-4xl md:text-5xl font-serif text-skin-charcoal capitalize font-medium">
          {id}s
        </h2>
        <p className="text-xs uppercase tracking-widest text-skin-charcoal/50">
          Showing {products.length} skincare products
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-skin-sand/35 rounded-2xl max-w-md mx-auto space-y-4">
          <p className="text-skin-charcoal/60 text-sm">
            No products found in the "{id}" category.
          </p>
          <Link
            href="/product"
            className="inline-block bg-skin-charcoal text-white hover:bg-skin-sage text-xs uppercase tracking-widest font-bold px-6 py-3.5 rounded-xl transition"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
