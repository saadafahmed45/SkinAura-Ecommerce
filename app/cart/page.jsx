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
    <div className="mx-auto py-28 px-6 md:px-12 lg:px-20 bg-skin-cream/10">
      <div className="max-w-5xl mx-auto bg-white border border-skin-sand/35 rounded-2xl shadow-sm p-6 sm:p-8 lg:p-12">
        <h2 className="text-3xl font-serif text-skin-charcoal font-semibold mb-10 border-b border-skin-sand/30 pb-4">
          Your Shopping Cart
        </h2>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <p className="text-skin-charcoal/60 text-lg">Your cart is empty 😔</p>
            <Link
              href="/product"
              className="inline-block bg-skin-charcoal text-white hover:bg-skin-sage text-xs uppercase tracking-widest font-bold px-6 py-3.5 rounded-xl transition-all duration-300"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-skin-sand/30 bg-skin-cream/10 hover:shadow-sm transition gap-4"
                >
                  {/* Left */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item?.images?.[0]}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover bg-white p-1 border border-skin-sand/20"
                    />

                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-md font-medium text-skin-charcoal">{item.name}</h3>
                      <p className="text-skin-terracotta text-xs font-bold">
                        ${Number(item.price || 0).toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => decrementQuantity(item.id)}
                          className="w-7 h-7 rounded-xl border border-skin-sand text-skin-charcoal text-xs hover:bg-skin-sand flex items-center justify-center font-bold"
                        >
                          −
                        </button>
                        <span className="font-semibold text-xs text-skin-charcoal">{item.quantity}</span>
                        <button
                          onClick={() => incrementQuantity(item.id)}
                          className="w-7 h-7 rounded-xl border border-skin-sand text-skin-charcoal text-xs hover:bg-skin-sand flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-4 border-t sm:border-t-0 pt-4 sm:pt-0">
                    <p className="font-semibold text-sm text-skin-charcoal">
                      Total: ${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                    </p>

                    <div className="flex gap-4">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center text-xs text-red-500 hover:text-red-600 transition"
                      >
                        <FaTrash className="mr-1.5 text-[10px]" /> Remove
                      </button>
                      <button className="flex items-center text-xs text-skin-sage hover:text-skin-charcoal transition">
                        <FaHeart className="mr-1.5 text-[10px]" /> Favorite
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-10 border-t border-skin-sand/40 pt-8 space-y-4 max-w-md ml-auto">
              <div className="flex justify-between text-xs uppercase tracking-wider text-skin-charcoal/60">
                <span>Subtotal</span>
                <span className="font-semibold text-skin-charcoal">${Number(subtotal || 0).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-xs uppercase tracking-wider text-skin-charcoal/60">
                <span>Shipping Fee</span>
                <span className="font-semibold text-skin-charcoal">${Number(deliveryFee || 0).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-md uppercase tracking-wider font-bold border-t border-skin-sand/20 pt-4 text-skin-charcoal">
                <span>Total</span>
                <span className="text-lg text-skin-terracotta">${Number(total || 0).toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center gap-4 pt-6">
                <Link
                  href="/product"
                  className="px-5 py-3 border border-skin-sand text-xs uppercase tracking-widest font-semibold rounded-xl text-skin-charcoal hover:bg-skin-sand transition text-center"
                >
                  Shop More
                </Link>

                <Link href={"/cart/checkout"} className="flex-grow">
                  <button className="w-full py-3 bg-skin-charcoal text-white hover:bg-skin-sage text-xs uppercase tracking-widest font-bold rounded-xl shadow-md transition text-center">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
