"use client";

import React from "react";
import Link from "next/link";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const FeaturePDCard = (product) => {
  const {
    id,
    name,
    price,
    discountPrice,
    discount,
    rating,
    images,
    createdAt,
    brand,
    category,
    inStock = true,
  } = product;

  const { handleAddedCart } = useCart();

  const isNew =
    new Date().getTime() - new Date(createdAt).getTime() <
    1000 * 60 * 60 * 24 * 30;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddedCart(product);
  };

  const renderStars = (ratingValue) => {
    const filledStars = Math.round(ratingValue);
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`w-3.5 h-3.5 ${
          i < filledStars ? "text-skin-gold" : "text-skin-sand"
        }`}
      />
    ));
  };

  const finalPrice = discount > 0 ? discountPrice : price;

  return (
    <div className="group bg-white rounded-2xl border border-skin-sand/35 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <Link href={`/product/${id}`} className="block">
        {/* IMAGE */}
        <div className="relative w-full h-72 overflow-hidden bg-skin-cream/40">
          <img
            src={images[0]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* DISCOUNT BADGE */}
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-skin-terracotta text-white text-[10px] px-2.5 py-1 rounded-lg font-bold shadow-sm">
              -{discount}%
            </span>
          )}

          {/* NEW BADGE */}
          {isNew && (
            <span className="absolute top-3 left-3 bg-skin-sage text-white text-[10px] px-2.5 py-1 rounded-lg font-bold shadow-sm">
              NEW
            </span>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-4 flex flex-col gap-2">
          {/* Brand + Category */}
          <p className="text-[10px] text-skin-charcoal/50 uppercase tracking-widest font-semibold">
            {brand} • {category}
          </p>

          {/* Name */}
          <h3 className="text-skin-charcoal font-serif text-lg line-clamp-1 group-hover:text-skin-terracotta transition-colors duration-200">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex">{renderStars(rating)}</div>
            <span className="text-[11px] text-skin-charcoal/60">({rating})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-md font-bold text-skin-terracotta">
              ${finalPrice.toFixed(2)}
            </span>
            {discount > 0 && (
              <span className="text-xs text-skin-charcoal/40 line-through">
                ${price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* ADD TO CART BUTTON (Outside Link for correct bubbling) */}
      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`w-full py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold shadow-sm transition-all duration-300 flex items-center justify-center gap-2 ${
            inStock
              ? "bg-skin-charcoal text-white hover:bg-skin-sage active:scale-[0.98]"
              : "bg-skin-sand text-skin-charcoal/40 cursor-not-allowed"
          }`}
        >
          <FaShoppingCart className="text-xs" />
          {inStock ? "Add to Cart" : "Unavailable"}
        </button>
      </div>
    </div>
  );
};

export default FeaturePDCard;
