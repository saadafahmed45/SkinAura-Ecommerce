"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import ProductCard from "./ProductCard";
import FeaturePDCard from "./FeaturePDCard";

const FeatureProducts = ({ categoryId, categoryName }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.escuelajs.co/api/v1/products?categoryId=${categoryId}&limit=8`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryProducts();
    }
  }, [categoryId]);

  const renderStars = (count = 5) => {
    return Array.from({ length: count }, (_, i) => (
      <FaStar key={i} className="text-yellow-400 w-4 h-4" />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-gray-500">Loading {categoryName} products...</p>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto px-6 md:px-12 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">{categoryName}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.slice(0, 4).map((product) => (
          <FeaturePDCard key={product.id} {...product} />
        ))}

        {products.length === 0 && (
          <div className="col-span-full text-center text-gray-400">
            No products found in {categoryName}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureProducts;
