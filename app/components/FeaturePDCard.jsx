"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaStar, FaRegStar, FaHeart } from "react-icons/fa";
import { FiShoppingCart, FiEye } from "react-icons/fi";
import { useCart } from "../context/CartContext";

const FeaturePDCard = ({ product }) => {
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
    reviewCount,
    inStock,
  } = product;

  const { handleAddedCart } = useCart();
  const [wishlist, setWishlist] = useState(false);

  const isNew =
    new Date().getTime() - new Date(createdAt).getTime() <
    1000 * 60 * 60 * 24 * 30;

  const renderStars = () =>
    Array.from({ length: 5 }, (_, i) =>
      i < Math.round(rating) ? (
        <FaStar key={i} className="text-skin-gold text-[11px]" />
      ) : (
        <FaRegStar key={i} className="text-skin-sand text-[11px]" />
      )
    );

  const finalPrice = discount > 0 ? discountPrice : price;

  return (
    <div className="group relative bg-white rounded-2xl border border-skin-sand/40 overflow-hidden hover:border-skin-terracotta/30 hover:shadow-xl hover:shadow-skin-terracotta/8 transition-all duration-400 flex flex-col">

      {/* IMAGE AREA */}
      <div className="relative h-[250px] sm:h-[280px] bg-skin-cream/40 overflow-hidden">
        
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {isNew && (
            <span className="bg-skin-sage text-white text-[9px] px-2.5 py-1 rounded-lg font-bold tracking-wider uppercase shadow-sm">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="bg-skin-terracotta text-white text-[9px] px-2.5 py-1 rounded-lg font-bold tracking-wider uppercase shadow-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => setWishlist(!wishlist)}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm ${
            wishlist
              ? "bg-skin-terracotta text-white"
              : "bg-white/80 backdrop-blur-sm text-skin-charcoal/50 hover:text-skin-terracotta hover:bg-white"
          }`}
        >
          <FaHeart size={11} />
        </button>

        {/* Image */}
        <Link href={`/product/${id}`} className="block w-full h-full">
          <img
            src={images[0]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          />
        </Link>

        {/* Quick Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 flex gap-px">
          <button
            onClick={() => handleAddedCart(product)}
            disabled={inStock === false}
            className="flex-1 py-3.5 bg-skin-charcoal text-white text-[10px] tracking-[0.18em] uppercase font-bold hover:bg-skin-terracotta transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <FiShoppingCart size={13} />
            Add to Cart
          </button>
          <Link
            href={`/product/${id}`}
            className="w-12 bg-skin-charcoal/90 hover:bg-skin-terracotta text-white flex items-center justify-center transition-colors duration-200"
          >
            <FiEye size={14} />
          </Link>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-1.5">
        {/* Brand */}
        {brand && (
          <p className="text-[9px] uppercase tracking-[0.2em] text-skin-charcoal/40 font-semibold">
            {brand}
          </p>
        )}

        {/* Name */}
        <Link href={`/product/${id}`}>
          <h3 className="text-sm font-serif text-skin-charcoal hover:text-skin-terracotta transition-colors duration-200 line-clamp-2 font-medium leading-snug">
            {name}
          </h3>
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-1.5">
          <div className="flex">{renderStars()}</div>
          <span className="text-[10px] text-skin-charcoal/45">
            ({reviewCount ?? Math.floor(Math.random() * 200 + 20)})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-base font-bold text-skin-terracotta">
            Rs. {finalPrice?.toFixed(2)}
          </span>
          {discount > 0 && (
            <span className="text-xs text-skin-charcoal/35 line-through">
              Rs. {price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturePDCard;
