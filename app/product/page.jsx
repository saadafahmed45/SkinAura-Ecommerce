"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    category: "all",
    minPrice: 0,
    maxPrice: 1000,
    search: "",
  });

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://api.escuelajs.co/api/v1/products");
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("https://api.escuelajs.co/api/v1/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Apply filters
  useEffect(() => {
    let temp = [...products];

    // Filter by category
    if (filters.category !== "all") {
      temp = temp.filter((p) => p.category?.id === Number(filters.category));
    }

    // Filter by price
    temp = temp.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
    );

    // Filter by search
    if (filters.search.trim() !== "") {
      temp = temp.filter((p) =>
        p.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredProducts(temp);
  }, [filters, products]);

  return (
    <div className="max-w-8xl mx-auto px-6 md:px-12 py-12">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 items-center">
        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Price */}
        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) =>
            setFilters({ ...filters, minPrice: Number(e.target.value) })
          }
          className="border rounded-md px-3 py-2 w-24 focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters({ ...filters, maxPrice: Number(e.target.value) })
          }
          className="border rounded-md px-3 py-2 w-24 focus:ring-2 focus:ring-blue-400"
        />

        {/* Search */}
        <input
          type="text"
          placeholder="Search Product..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border rounded-md px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Products Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-gray-400">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
