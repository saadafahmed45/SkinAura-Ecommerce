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

  const productsPerPage = 8;

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
    <div className="mx-auto px-6 md:px-12 lg:px-20 py-28 bg-skin-cream/20">
      {/* Breadcrumb */}
      <div className="text-xs text-skin-charcoal/60 uppercase tracking-widest mb-10">
        <ol className="flex items-center space-x-2.5">
          <li>
            <Link href="/" className="hover:text-skin-terracotta transition-colors duration-200">
              Home
            </Link>
          </li>
          <span>/</span>
          <li className="hover:text-skin-terracotta cursor-pointer transition-colors duration-200">Skincare</li>
          <span>/</span>
          <li className="font-semibold text-skin-charcoal">Products</li>
        </ol>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filter */}
        <aside className="w-full lg:w-64 rounded-2xl p-6 border border-skin-sand/40 bg-white shadow-sm h-fit">
          <h3 className="text-md font-serif text-skin-charcoal font-semibold mb-6 flex items-center gap-2.5">
            <FiSliders className="text-skin-terracotta" /> Filter by
          </h3>

          {/* Category Filter */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-skin-charcoal/50">
              Categories
            </h4>
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li
                  key={cat}
                  className={`cursor-pointer capitalize px-3 py-2 rounded-xl text-xs tracking-wider transition-all duration-300 ${
                    selectedCategory === cat
                      ? "bg-skin-charcoal text-white font-bold"
                      : "text-skin-charcoal hover:bg-skin-sand"
                  }`}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                >
                  {cat === "all" ? "All Products" : cat}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Products */}
        <div className="flex-1">
          {/* Title + Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-serif text-skin-charcoal font-medium">
                Skincare Products
              </h2>
              <p className="text-xs text-skin-charcoal/50 mt-1 uppercase tracking-widest">
                Showing {filteredProducts.length} items
              </p>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-skin-sand rounded-xl px-4 py-2.5 text-xs uppercase tracking-wider font-semibold shadow-sm bg-white focus:outline-none focus:ring-1 focus:ring-skin-sage text-skin-charcoal"
            >
              <option value="">Sort By</option>
              <option value="name-asc">Name (A - Z)</option>
              <option value="price-low">Price (Low → High)</option>
              <option value="price-high">Price (High → Low)</option>
            </select>
          </div>

          {/* Product Grid */}
          {currentProducts.length === 0 ? (
            <div className="text-center py-20 bg-white border border-skin-sand/30 rounded-2xl">
              <p className="text-skin-charcoal/60 text-sm">No skincare products match your filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* ---------- Pagination ---------- */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                  className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-xl border transition-all duration-300 ${
                    currentPage === 1
                      ? "cursor-not-allowed bg-skin-sand/30 text-skin-charcoal/30 border-skin-sand/20"
                      : "bg-white text-skin-charcoal border-skin-sand hover:bg-skin-charcoal hover:text-white"
                  }`}
                >
                  Prev
                </button>

                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-9 h-9 rounded-xl border text-xs font-semibold transition-all duration-300 ${
                        currentPage === page
                          ? "bg-skin-terracotta text-white border-skin-terracotta"
                          : "bg-white text-skin-charcoal border-skin-sand hover:bg-skin-charcoal hover:text-white"
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
                  className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-xl border transition-all duration-300 ${
                    currentPage === totalPages
                      ? "cursor-not-allowed bg-skin-sand/30 text-skin-charcoal/30 border-skin-sand/20"
                      : "bg-white text-skin-charcoal border-skin-sand hover:bg-skin-charcoal hover:text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
