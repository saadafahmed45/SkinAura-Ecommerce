"use client";

import { useState } from "react";
import Link from "next/link";
import { skincareProducts } from "../api/skinData";
import ProductCard from "../components/ProductCard";
import { FiSliders } from "react-icons/fi";

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8; // You can change this

  const categories = [
    "all",
    ...new Set(skincareProducts.map((p) => p.category)),
  ];

  // ------------ Filter Products ------------
  let filteredProducts =
    selectedCategory === "all"
      ? skincareProducts
      : skincareProducts.filter((p) => p.category === selectedCategory);

  // ------------ Sort Products ------------
  if (sortOption === "name-asc")
    filteredProducts = [...filteredProducts].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

  if (sortOption === "price-low")
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);

  if (sortOption === "price-high")
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);

  // ------------ Pagination Logic ------------
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;

  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => setCurrentPage(page);

  return (
    <div className="mx-auto px-6 md:px-20 py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-6">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-black">
              Home
            </Link>
          </li>
          <span>/</span>
          <li className="hover:text-black cursor-pointer">Skincare</li>
          <span>/</span>
          <li className="font-semibold text-gray-900">Products</li>
        </ol>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Filter */}
        <aside className="w-full lg:w-64 rounded-xl p-6 shadow-lg bg-white">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiSliders /> Filters
          </h3>

          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Category
            </h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li
                  key={cat}
                  className={`cursor-pointer capitalize p-2 rounded-lg text-sm ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1); // reset page
                  }}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Products */}
        <div className="flex-1">
          {/* Title + Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Skincare Products
              </h2>
              <p className="text-gray-600 mt-2">
                Showing {filteredProducts.length} products
              </p>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setCurrentPage(1); // reset
              }}
              className="mt-4 sm:mt-0 border rounded-lg px-4 py-2 shadow-sm bg-white"
            >
              <option value="">Sort By</option>
              <option value="name-asc">Name (A - Z)</option>
              <option value="price-low">Price (Low → High)</option>
              <option value="price-high">Price (High → Low)</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* ---------- Pagination ---------- */}
          <div className="flex justify-center mt-10">
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
                className={`px-4 py-2 mx-1 rounded-md flex items-center gap-2 ${
                  currentPage === 1
                    ? "cursor-not-allowed bg-gray-200 text-gray-400"
                    : "bg-white text-gray-700 hover:bg-blue-500 hover:text-white"
                }`}
              >
                <span>Previous</span>
              </button>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-4 py-2 mx-1 rounded-md ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-blue-500 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
                className={`px-4 py-2 mx-1 rounded-md flex items-center gap-2 ${
                  currentPage === totalPages
                    ? "cursor-not-allowed bg-gray-200 text-gray-400"
                    : "bg-white text-gray-700 hover:bg-blue-500 hover:text-white"
                }`}
              >
                <span>Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
