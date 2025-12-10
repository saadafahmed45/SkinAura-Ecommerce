"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function MyOrders() {
  const { orders } = useCart();

  return (
    <div className="max-w-6xl mx-auto py-24 px-6 lg:px-12 mt-24">
      <h1 className="text-3xl font-bold mb-10 text-gray-900">My Orders</h1>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <p className="text-lg text-gray-600">
            You haven’t placed any orders yet 😔
          </p>
          <Link
            href="/"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Start Shopping
          </Link>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white border rounded-2xl shadow-md p-6"
          >
            {/* Header */}
            <div className="flex flex-wrap justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold">{order.id}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold">
                  {new Date(order.date).toLocaleDateString()}
                </p>
              </div>

              <div>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold ${
                    order.customer.paymentMethod === "cod"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {order.customer.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "Advance Payment"}
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <p className="font-semibold mb-1">Shipping Information</p>
              <p className="text-sm text-gray-600">{order.customer.name}</p>
              <p className="text-sm text-gray-600">{order.customer.phone}</p>
              <p className="text-sm text-gray-600">{order.customer.address}</p>
            </div>

            {/* Items */}
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-3 last:border-none"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">€{item.totalPrice.toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>€{order.subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Delivery</span>
                <span>€{order.deliveryFee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>€{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
