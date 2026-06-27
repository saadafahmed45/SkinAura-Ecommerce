"use client";

import { useCart } from "@/app/context/CartContext";
import { useState } from "react";
import Link from "next/link";

export default function Checkout() {
  const { cartItems, subtotal, deliveryFee, total, placeOrder } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const customerInfo = {
      name: form.name.value,
      phone: form.phone.value,
      address: form.address.value,
      paymentMethod,
    };

    placeOrder(customerInfo);
  };

  return (
    <div className="mx-auto py-28 px-6 md:px-12 lg:px-20 bg-skin-cream/10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif text-skin-charcoal font-semibold mb-10 border-b border-skin-sand/30 pb-4">
          Checkout Information
        </h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* LEFT — FORM */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white border border-skin-sand/35 p-8 rounded-2xl shadow-sm space-y-6"
          >
            <h2 className="text-lg font-serif font-semibold text-skin-charcoal mb-4">
              Shipping & Delivery Details
            </h2>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-skin-charcoal/60">Full Name</label>
              <input
                name="name"
                required
                placeholder="John Doe"
                className="w-full border border-skin-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-skin-sage focus:ring-1 focus:ring-skin-sage bg-skin-cream/10"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-skin-charcoal/60">Phone Number</label>
              <input
                name="phone"
                required
                placeholder="+1 (555) 000-0000"
                className="w-full border border-skin-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-skin-sage focus:ring-1 focus:ring-skin-sage bg-skin-cream/10"
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-skin-charcoal/60">Shipping Address</label>
              <textarea
                name="address"
                required
                placeholder="Apartment, suite, street name, city, state, zip code"
                rows="4"
                className="w-full border border-skin-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-skin-sage focus:ring-1 focus:ring-skin-sage bg-skin-cream/10"
              />
            </div>

            {/* Payment Method */}
            <div className="pt-4 space-y-4">
              <h2 className="text-md font-serif font-semibold text-skin-charcoal">Payment Method</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Cash on Delivery */}
                <label className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                  paymentMethod === "cod" ? "border-skin-terracotta bg-skin-sand/10" : "border-skin-sand hover:border-skin-sage"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    className="mt-1 accent-skin-terracotta"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-skin-charcoal">Cash on Delivery</p>
                    <p className="text-[11px] text-skin-charcoal/60 mt-1">
                      Pay in cash when your order is delivered to your doorstep.
                    </p>
                  </div>
                </label>

                {/* Advance Payment */}
                <label className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                  paymentMethod === "advance" ? "border-skin-terracotta bg-skin-sand/10" : "border-skin-sand hover:border-skin-sage"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    className="mt-1 accent-skin-terracotta"
                    checked={paymentMethod === "advance"}
                    onChange={() => setPaymentMethod("advance")}
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-skin-charcoal">Advance Payment</p>
                    <p className="text-[11px] text-skin-charcoal/60 mt-1">
                      Pay instantly with bKash, Credit Cards, or Online banking.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Advance Payment Note */}
            {paymentMethod === "advance" && (
              <div className="bg-skin-sand/30 border border-skin-sand p-4 rounded-xl text-xs text-skin-charcoal/80 flex items-center gap-2">
                <span>🔐</span>
                <span>After placing your order, you will be redirected to the secure checkout payment gateway.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-4 bg-skin-charcoal text-white py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-skin-sage transition-all duration-300 shadow-md"
            >
              Place Skincare Order
            </button>
          </form>

          {/* RIGHT — ORDER SUMMARY */}
          <div className="bg-white border border-skin-sand/35 p-6 sm:p-8 rounded-2xl shadow-sm h-fit space-y-6">
            <h2 className="text-lg font-serif font-semibold text-skin-charcoal border-b border-skin-sand/20 pb-3">
              Order Summary
            </h2>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-skin-sand text-skin-charcoal flex items-center justify-center font-bold rounded-lg text-[10px]">
                      {item.quantity}
                    </span>
                    <span className="text-skin-charcoal font-medium truncate max-w-[150px]">{item.name}</span>
                  </div>
                  <span className="font-semibold text-skin-charcoal">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <hr className="border-skin-sand/20" />

            <div className="space-y-3 text-xs uppercase tracking-wider text-skin-charcoal/60">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-skin-charcoal">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-semibold text-skin-charcoal">${deliveryFee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm uppercase tracking-wider font-bold border-t border-skin-sand/20 pt-4 text-skin-charcoal">
                <span>Total</span>
                <span className="text-md text-skin-terracotta font-bold">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
