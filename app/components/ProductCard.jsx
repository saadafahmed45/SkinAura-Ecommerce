"use client";
import React from "react";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

const ProductCard = ({ id, title, price, images, creationAt }) => {
  const isNew =
    new Date().getTime() - new Date(creationAt).getTime() <
    1000 * 60 * 60 * 24 * 30; // less than 30 days

  const renderStars = (count = 5) => {
    return Array.from({ length: count }, (_, i) => (
      <FaStar key={i} className="text-yellow-400 w-4 h-4" />
    ));
  };

  return (
    <Link href={`/product/${id}`}>
      <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg overflow-hidden cursor-pointer transition duration-300">
        {/* Image */}
        <div className="relative w-full h-72 overflow-hidden">
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-110"
          />

          {/* Quick View Button */}
          <button className="absolute top-3 right-3 px-3 py-1 text-sm bg-white rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Quick View
          </button>

          {/* New Badge */}
          {isNew && (
            <span className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 text-xs rounded-full">
              NEW
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col justify-between">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {title}
          </h3>
          <div className="flex items-center mt-1">{renderStars(5)}</div>
          <p className="text-blue-600 font-bold mt-2">${price}</p>
          <button className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-500 transition-colors duration-300">
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
