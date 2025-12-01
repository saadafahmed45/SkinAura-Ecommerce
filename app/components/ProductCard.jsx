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
    handleAddedCart(product);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={`full-${i}`} className="text-yellow-400 w-4 h-4" />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key="half" className="text-yellow-400 w-4 h-4" />
      );
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaRegStar key={`empty-${i}`} className="text-yellow-400 w-4 h-4" />
      );
    }
    return stars;
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-transform duration-300 transform hover:-translate-y-1">
      {/* Discount / Stock Badge */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
        {discount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{discount}%
          </span>
        )}
        {!inStock && (
          <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-lg">
            Out of Stock
          </span>
        )}
      </div>

      {/* Product Image */}
      <Link href={`/product/${id}`}>
        <div className="relative w-full h-72 overflow-hidden bg-gray-100">
          <img
            src={images[0]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Quick Add Button */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button className="bg-white shadow-md px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-gray-50">
              <FaShoppingCart /> Quick Add
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        <p className="text-xs text-gray-500 uppercase tracking-wide">{brand}</p>

        {/* Product Name */}
        <h3 className="text-lg font-semibold mt-1 text-gray-800 line-clamp-2 min-h-[3.5rem]">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex">{renderStars(rating)}</div>
          <span className="text-sm text-gray-600">
            {rating} ({reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center gap-3">
          <p className="text-blue-600 font-bold text-xl">
            ${discount > 0 ? discountPrice.toFixed(2) : price.toFixed(2)}
          </p>
          {discount > 0 && (
            <p className="text-gray-400 line-through text-sm">
              ${price.toFixed(2)}
            </p>
          )}
        </div>

        {/* Low Stock Alert */}
        {inStock && stock < 20 && (
          <p className="text-orange-500 text-xs mt-2">
            Only {stock} left — hurry!
          </p>
        )}
      </div>

      {/* Floating Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={!inStock}
        className={`absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition duration-300 px-3 py-2 rounded-lg text-sm font-bold shadow-md flex items-center gap-2 ${
          inStock
            ? "bg-blue-600 text-white hover:bg-blue-500"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
      >
        <FaShoppingCart className="text-sm" />
        {inStock ? "Add to Cart" : "Unavailable"}
      </button>
    </div>
  );
};

export default ProductCard;
