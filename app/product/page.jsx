"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const Product = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://api.escuelajs.co/api/v1/products"
        );
        setProducts(response.data); // store fetched data
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 p-6 md:p-12">
      {products.map(({ id, title, price, images }) => (
        <div
          key={id}
          className="flex flex-col items-center justify-center w-full max-w-sm mx-auto my-8"
        >
          {/* Product image */}
          <div
            className="w-full h-64 bg-gray-300 bg-center bg-cover rounded-lg shadow-md"
            style={{ backgroundImage: `url(${images[1]})` }}
          ></div>
          {/* Product info */}
          <div className="w-56 -mt-10 overflow-hidden bg-white rounded-lg shadow-lg md:w-64">
            <h3 className="py-2 font-bold tracking-wide text-center text-gray-800 uppercase">
              {title}
            </h3>

            <div className="flex items-center justify-between px-3 py-2 bg-gray-200">
              <span className="font-bold text-gray-800">${price}</span>
              <button className="px-2 py-1 text-xs font-semibold text-white uppercase transition-colors duration-300 transform bg-gray-800 rounded hover:bg-gray-700 focus:bg-gray-700 focus:outline-none">
                Add to cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Product;
