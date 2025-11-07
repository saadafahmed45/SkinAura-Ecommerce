"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://api.escuelajs.co/api/v1/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-12 py-12">
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Product Categories
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {categories.slice(0, 4).map(({ id, name, image }) => (
          <Link key={id} href={`/category/${id}`}>
            <div className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg transition-transform transform hover:scale-105">
              <img
                src={image}
                alt={name}
                className="w-full h-64 object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <h3 className="text-white text-2xl font-semibold">{name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Category;
