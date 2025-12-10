"use client";

import { FaTrash, FaHeart } from "react-icons/fa";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    cartItems,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    total,
  } = useCart();

  return (
    <div className="max-w-5xl mx-auto py-24 my-8 px-6 lg:px-12 bg-blue-50 rounded-2xl shadow-lg mt-24">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-3">
        Your Cart
      </h2>

      {/* Empty Cart */}
      {cartItems.length === 0 && (
        <div className="py-20 text-center text-gray-600">
          <p className="text-xl">Your cart is empty 😔</p>
          <Link
            href="/"
            className="mt-4 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Go Shopping
          </Link>
        </div>
      )}

      {/* Cart Items */}
      <div className="space-y-6">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 rounded-xl border bg-white hover:shadow-md transition"
          >
            {/* Left */}
            <div className="flex items-center gap-4">
              <img
                src={item?.images?.[0]}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover bg-gray-100"
              />

              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>

                <p className="text-blue-500 font-bold">
                  €{item.price.toFixed(2)}
                </p>

                {/* Quantity Controls ✅ */}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => decrementQuantity(item.id)}
                    className="w-8 h-8 rounded-full border text-lg hover:bg-gray-100"
                  >
                    −
                  </button>

                  <span className="font-semibold text-lg">{item.quantity}</span>

                  <button
                    onClick={() => incrementQuantity(item.id)}
                    className="w-8 h-8 rounded-full border text-lg hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col items-end gap-3">
              <p className="font-semibold text-gray-800">
                €{item.totalPrice.toFixed(2)}
              </p>

              <button
                onClick={() => removeFromCart(item.id)}
                className="flex items-center text-red-500 hover:text-red-600"
              >
                <FaTrash className="mr-2" /> Remove
              </button>

              <button className="flex items-center text-blue-500 hover:text-blue-600">
                <FaHeart className="mr-2" /> Favorite
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      {cartItems.length > 0 && (
        <div className="mt-10 border-t pt-6">
          <div className="flex justify-between text-lg mb-2">
            <span>Subtotal</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-lg mb-2">
            <span>Delivery Fee</span>
            <span>€{deliveryFee.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-xl font-bold mt-3">
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center mt-8">
            <Link
              href="/"
              className="px-5 py-2 border rounded-lg hover:bg-gray-100"
            >
              Back to Shop
            </Link>

            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Link href={"/cart/checkout"}>Checkout </Link>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
