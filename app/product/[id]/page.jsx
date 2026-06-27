"use client";

import { skincareProducts } from "@/app/api/skinData";
import ProductCard from "@/app/components/ProductCard";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import React, { useState } from "react";

const ProductDetails = ({ params }) => {
  const { id } = React.use(params);
  const product = skincareProducts.find((m) => m.id === parseInt(id));

  const { handleAddedCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    handleAddedCart(product);
  };

  const [selectedImage, setSelectedImage] = useState(
    product?.images?.[0] || ""
  );

  if (!product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-skin-cream">
        <p className="text-skin-terracotta text-lg font-serif mb-4">Product not found!</p>
        <Link href="/product" className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest bg-skin-charcoal text-white rounded-xl">
          Back to Shop
        </Link>
      </div>
    );
  }

  const relatedProducts = skincareProducts
    .filter((m) => m.category === product.category && m.id !== product.id)
    .slice(0, 4);

  return (
    <div className="px-6 lg:px-16 xl:px-24 py-28 mx-auto bg-skin-cream/10">
      {/* Breadcrumb */}
      <nav className="text-[11px] text-skin-charcoal/50 uppercase tracking-widest mb-10">
        <ul className="flex items-center space-x-2.5">
          <li>
            <Link href="/" className="hover:text-skin-terracotta transition-colors duration-200">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href={`/category/${product.category}`}
              className="hover:text-skin-terracotta transition-colors duration-200"
            >
              {product.category}
            </Link>
          </li>
          <li>/</li>
          <li className="text-skin-charcoal font-semibold truncate max-w-[200px]">
            {product.name}
          </li>
        </ul>
      </nav>

      {/* Product Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          {/* Main Image */}
          <div className="rounded-2xl overflow-hidden border border-skin-sand/40 bg-white aspect-square shadow-sm flex items-center justify-center p-6">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-500 hover:scale-102"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex flex-wrap gap-3 mt-2">
            {product.images?.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`relative w-20 h-20 border rounded-xl overflow-hidden flex items-center justify-center bg-white p-2 transition-all duration-300
                ${
                  selectedImage === img
                    ? "ring-2 ring-skin-terracotta border-skin-terracotta"
                    : "hover:ring-1 hover:ring-skin-sage border-skin-sand"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <span className="text-[10px] text-skin-terracotta uppercase tracking-widest font-bold">
              {product.brand}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-skin-charcoal leading-tight font-medium">
              {product.name}
            </h1>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-skin-terracotta">
              ${(product.discountPrice ? product.discountPrice : product.price).toFixed(2)}
            </h2>
            {product.discount > 0 && (
              <>
                <p className="text-skin-charcoal/40 line-through text-lg">
                  ${product.price.toFixed(2)}
                </p>
                <span className="px-2.5 py-1 bg-skin-terracotta text-white text-[10px] tracking-wider uppercase font-bold rounded-lg shadow-sm">
                  Save {product.discount}%
                </span>
              </>
            )}
          </div>

          {/* Stock Info */}
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`}></span>
            <p className="text-xs uppercase tracking-wider font-semibold text-skin-charcoal/70">
              {product.inStock
                ? `In Stock (${product.stock} products available)`
                : "Temporarily Out of Stock"}
            </p>
          </div>

          <hr className="border-skin-sand/40" />

          {/* Description */}
          <p className="text-sm text-skin-charcoal/80 leading-relaxed font-light font-sans">
            {product.description}
          </p>

          {/* Ingredients */}
          {product.ingredients && (
            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-widest font-bold text-skin-charcoal">Actives & Ingredients</h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {product.ingredients.map((ing, i) => (
                  <span key={i} className="bg-skin-sand/65 text-skin-charcoal px-3 py-1.5 text-xs rounded-xl border border-skin-sand/40">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skin Type */}
          {product.skinType && (
            <div className="space-y-1">
              <h3 className="text-xs uppercase tracking-widest font-bold text-skin-charcoal">Recommended Skin Type</h3>
              <p className="text-sm text-skin-charcoal/80 font-light font-sans">{product.skinType.join(", ")}</p>
            </div>
          )}

          {/* Tags */}
          {product.tags && (
            <div className="flex flex-wrap gap-2 pt-1">
              {product.tags.map((t, i) => (
                <span
                  key={i}
                  className="text-[10px] font-semibold text-skin-terracotta/80 uppercase tracking-wider"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          <hr className="border-skin-sand/40" />

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold shadow-md transition-all duration-300 ${
                product.inStock
                  ? "bg-skin-charcoal hover:bg-skin-sage text-white active:scale-[0.98]"
                  : "bg-skin-sand text-skin-charcoal/40 cursor-not-allowed"
              }`}
            >
              {product.inStock ? "Add to Cart" : "Unavailable"}
            </button>
            <button 
              disabled={!product.inStock}
              onClick={handleAddToCart}
              className={`flex-1 px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold border transition-all duration-300 ${
                product.inStock
                  ? "border-skin-charcoal text-skin-charcoal hover:bg-skin-sand"
                  : "border-skin-sand/40 text-skin-charcoal/30 cursor-not-allowed"
              }`}
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-skin-sand/40 pt-16">
          <h2 className="text-2xl md:text-3xl font-serif text-skin-charcoal font-medium mb-10">
            Complete Your Ritual
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
