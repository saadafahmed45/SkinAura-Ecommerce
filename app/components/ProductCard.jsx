"use client";
import React from "react";
import Link from "next/link";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShoppingCart,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const {
    id,
    name,
    price,
    discountPrice,
    discount,
    images,
    rating,
    reviewCount,
    inStock,
    stock,
    brand,
  } = product;

  const { handleAddedCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddedCart(product);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-skin-gold w-3.5 h-3.5" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <FaStarHalfAlt key={i} className="text-skin-gold w-3.5 h-3.5" />,
        );
      } else {
        stars.push(
          <FaRegStar key={i} className="text-skin-sand w-3.5 h-3.5" />,
        );
      }
    }
    return stars;
  };

  const finalPrice = discount > 0 ? discountPrice : price;

  return (
    <div className="group bg-white rounded-2xl border border-skin-sand/35 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Badges */}
        <div className="relative w-full h-64 overflow-hidden bg-skin-cream/40">
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="bg-skin-terracotta text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-lg shadow-sm">
                -{discount}%
              </span>
            )}
            {!inStock && (
              <span className="bg-skin-charcoal/80 text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-lg shadow-sm">
                Out of Stock
              </span>
            )}
          </div>

          <Link href={`/product/${id}`} className="block w-full h-full">
            <img
              src={images[0]}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Product Details */}
        <div className="p-4 space-y-2">
          {/* Brand */}
          <p className="text-[10px] text-skin-charcoal/50 uppercase tracking-widest font-semibold">
            {brand}
          </p>

          {/* Product Name */}
          <Link href={`/product/${id}`} className="block">
            <h3 className="text-md font-serif text-skin-charcoal hover:text-skin-terracotta transition-colors duration-200 line-clamp-2 min-h-[2.75rem] font-medium leading-snug">
              {name}
            </h3>
          </Link>

          {/* Rating */}
          {/* <div className="flex items-center gap-1.5 pt-0.5">
            <div className="flex">{renderStars(rating)}</div>
            <span className="text-[11px] text-skin-charcoal/60">
              ({reviewCount})
            </span>
          </div> */}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-md font-bold text-skin-terracotta">
              ${Number(finalPrice || 0).toFixed(2)}
            </span>
            {discount > 0 && (
              <span className="text-xs text-skin-charcoal/40 line-through">
                ${Number(price || 0).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
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

export default ProductCard;
