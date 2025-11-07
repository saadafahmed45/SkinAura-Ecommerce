"use client";
import React from "react";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

const FeaturePDCard = ({ id, title, price, images, creationAt }) => {
  const isNew =
    new Date().getTime() - new Date(creationAt).getTime() <
    1000 * 60 * 60 * 24 * 30;

  const renderStars = (count = 5) =>
    Array.from({ length: count }, (_, i) => (
      <FaStar key={i} className="text-yellow-400 w-4 h-4" />
    ));

  return (
    <Link href={`/product/${id}`}>
      <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer">
        {/* Image */}
        <div className="relative w-full h-64 overflow-hidden">
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {isNew && (
            <span className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 text-xs rounded font-medium">
              NEW
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col gap-2">
          <h3 className="text-gray-900 font-semibold text-lg truncate">
            {title}
          </h3>
          <div className="flex items-center">{renderStars(5)}</div>
          <p className="text-gray-900 font-bold text-lg">${price}</p>
          <button className="mt-2 w-full bg-blue-600 text-white text-sm font-medium py-2 rounded hover:bg-blue-500 transition-colors duration-200">
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default FeaturePDCard;
