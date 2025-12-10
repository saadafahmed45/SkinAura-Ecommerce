"use client";

import { useCart } from "@/app/context/CartContext";
import { useState } from "react";

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
    <div className="max-w-6xl mx-auto py-24 px-6 lg:px-12">
      <h1 className="text-3xl font-bold mb-10 text-gray-900">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* LEFT — FORM */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white p-8 rounded-2xl shadow space-y-6"
        >
          <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>

          {/* Name */}
          <input
            name="name"
            required
            placeholder="Full Name"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Phone */}
          <input
            name="phone"
            required
            placeholder="Phone Number"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Address */}
          <textarea
            name="address"
            required
            placeholder="Full Address"
            rows="4"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Payment Method */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Payment Method</h2>

            <div className="space-y-4">
              {/* Cash on Delivery */}
              <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:border-blue-500">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <div>
                  <p className="font-semibold">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">
                    Pay when you receive the product
                  </p>
                </div>
              </label>

              {/* Advance Payment */}
              <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:border-blue-500">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "advance"}
                  onChange={() => setPaymentMethod("advance")}
                />
                <div>
                  <p className="font-semibold">Advance Payment</p>
                  <p className="text-sm text-gray-500">
                    Pay now using Bkash / Card
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Advance Payment Note */}
          {paymentMethod === "advance" && (
            <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-700">
              🔐 After placing order, you will be redirected to payment
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
          >
            Place Order
          </button>
        </form>

        {/* RIGHT — ORDER SUMMARY */}
        <div className="bg-gray-50 p-8 rounded-2xl shadow h-fit">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>€{item.totalPrice.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <hr className="my-6" />

          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span>€{deliveryFee.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
