"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function MyOrders() {
  const { orders } = useCart();

  return (
    <div className="mx-auto py-28 px-6 md:px-12 lg:px-20 bg-skin-cream/10 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif text-skin-charcoal font-semibold mb-10 border-b border-skin-sand/30 pb-4">
          My Skincare Orders
        </h1>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white border border-skin-sand/35 rounded-2xl shadow-sm space-y-4">
            <p className="text-skin-charcoal/60 text-sm">
              You haven’t placed any orders yet 😔
            </p>
            <Link
              href="/product"
              className="inline-block bg-skin-charcoal text-white hover:bg-skin-sage text-xs uppercase tracking-widest font-bold px-6 py-3.5 rounded-xl transition-all duration-300"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-skin-sand/35 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6"
              >
                {/* Header */}
                <div className="flex flex-wrap justify-between items-center gap-4 border-b border-skin-sand/20 pb-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-skin-charcoal/50">Order ID</p>
                    <p className="text-sm font-semibold text-skin-charcoal">{order.id}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-skin-charcoal/50">Date</p>
                    <p className="text-sm font-semibold text-skin-charcoal">
                      {new Date(order.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold shadow-sm ${
                        order.customer.paymentMethod === "cod"
                          ? "bg-skin-sand text-skin-charcoal"
                          : "bg-skin-sage text-white"
                      }`}
                    >
                      {order.customer.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : "Paid via Gateway"}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-skin-cream/20 border border-skin-sand/20 p-4 rounded-xl space-y-2">
                  <p className="text-xs uppercase tracking-widest font-bold text-skin-charcoal">Shipping Information</p>
                  <div className="text-xs text-skin-charcoal/80 space-y-1 font-sans">
                    <p className="font-medium text-skin-charcoal">{order.customer.name}</p>
                    <p>{order.customer.phone}</p>
                    <p>{order.customer.address}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-widest font-bold text-skin-charcoal">Ordered Ritual Items</p>
                  <div className="divide-y divide-skin-sand/20">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item?.images?.[0]}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover bg-skin-cream/40 border border-skin-sand/20"
                          />
                          <div>
                            <p className="text-xs font-semibold text-skin-charcoal">{item.name}</p>
                            <p className="text-[10px] text-skin-charcoal/50 uppercase tracking-wider mt-0.5">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs font-bold text-skin-charcoal">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t border-skin-sand/20 pt-4 space-y-2.5 max-w-xs ml-auto text-xs uppercase tracking-wider text-skin-charcoal/60">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-skin-charcoal">${order.subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="font-semibold text-skin-charcoal">${order.deliveryFee.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm uppercase tracking-wider font-bold border-t border-skin-sand/20 pt-3 text-skin-charcoal">
                    <span>Total Paid</span>
                    <span className="text-md text-skin-terracotta font-bold">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
