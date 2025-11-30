"use client";

import { skincareProducts } from "@/app/api/skinData";
import ProductCard from "@/app/components/ProductCard";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { use } from "react";

const ProductDetails = ({ params }) => {
  // const { id } = params;
  const { id } = React.use(params); // slug
  const product = skincareProducts.find((m) => m.id === parseInt(id));

  // Fix: selected image state
  const [selectedImage, setSelectedImage] = useState(
    product?.images?.[0] || ""
  );

  // Fix: related products by category
  const relatedProducts = skincareProducts
    .filter((m) => m.category === product.category && m.id !== product.id)
    .slice(0, 4);

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">Product not found!</p>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-24 py-16 mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8">
        <ul className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="capitalize">{product.category}</li>
          <li>/</li>
          <li className="text-gray-800 font-medium truncate max-w-[150px]">
            {product.name}
          </li>
        </ul>
      </nav>

      {/* Product Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          {/* Main Image */}
          <div className=" rounded-2xl overflow-hidden shadow-lg">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full  object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3">
            {product.images?.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 border rounded-xl overflow-hidden ${
                  selectedImage === img
                    ? "ring-2 ring-blue-500"
                    : "hover:ring-2 hover:ring-gray-300"
                }`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-4">
          <span className="text-sm text-gray-500 uppercase tracking-wide">
            {product.brand}
          </span>

          <h1 className="text-4xl font-bold">{product.name}</h1>

          {/* Price */}
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-blue-600">
              ${product.discountPrice ? product.discountPrice : product.price}
            </h2>
            {product.discount > 0 && (
              <>
                <p className="text-gray-400 line-through text-lg">
                  ${product.price}
                </p>
                <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-md">
                  -{product.discount}%
                </span>
              </>
            )}
          </div>

          {/* Stock Info */}
          <p
            className={`${
              product.inStock ? "text-green-600" : "text-red-600"
            } font-medium`}
          >
            {product.inStock
              ? `In Stock (${product.stock} available)`
              : "Out of Stock"}
          </p>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          {/* Ingredients */}
          {product.ingredients && (
            <div>
              <h3 className="font-semibold mb-1">Ingredients:</h3>
              <ul className="list-disc pl-5 text-gray-700">
                {product.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Skin Type */}
          {product.skinType && (
            <div>
              <h3 className="font-semibold mb-1">Suitable For:</h3>
              <p className="text-gray-700">{product.skinType.join(", ")}</p>
            </div>
          )}

          {/* Tags */}
          {product.tags && (
            <div className="flex flex-wrap gap-2 mt-2">
              {product.tags.map((t, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-gray-700 px-3 py-1 text-sm rounded-full"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold">
              Add to Cart
            </button>
            <button className="border border-gray-300 px-6 py-3 rounded-lg font-semibold">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold mb-8">Related Products</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
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
