"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import Swal from "sweetalert2";

export default function MyOrders() {
  const { orders: localOrders } = useCart();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      if (res.data?.success && res.data.orders) {
        if (res.data.orders.length > 0) {
          setOrders(res.data.orders);
        } else {
          // Fall back to localOrders if any
          setOrders(localOrders || []);
        }
      } else {
        setOrders(localOrders || []);
      }
    } catch {
      setOrders(localOrders || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    const confirm = await Swal.fire({
      title: "Cancel this ritual order?",
      text: "This action will cancel the order and return items to stock.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C68B6E",
      cancelButtonColor: "#2A2925",
      confirmButtonText: "Yes, cancel order",
      cancelButtonText: "Keep order",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await api.patch(`/orders/${orderId}/cancel`);
        if (res.data?.success) {
          Swal.fire("Cancelled", "Your order has been cancelled.", "success");
          fetchOrders();
        }
      } catch (err) {
        Swal.fire("Error", err.customMessage || "Could not cancel order.", "error");
      }
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || "pending").toLowerCase();
    switch (s) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
      case "confirmed":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-skin-sand text-skin-charcoal border-skin-sand/60";
    }
  };

  return (
    <div className="mx-auto py-28 px-6 md:px-12 lg:px-20 bg-skin-cream/10 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-10 border-b border-skin-sand/30 pb-4">
          <div>
            <h1 className="text-3xl font-serif text-skin-charcoal font-semibold">
              My Skincare Orders
            </h1>
            <p className="text-xs uppercase tracking-wider text-skin-charcoal/50 mt-1">
              Track and review your skincare orders
            </p>
          </div>
          {orders.length > 0 && (
            <button
              onClick={fetchOrders}
              className="text-[11px] uppercase tracking-wider font-bold text-skin-terracotta hover:underline"
            >
              Refresh Status
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20 bg-white border border-skin-sand/35 rounded-2xl shadow-sm space-y-3">
            <div className="w-8 h-8 border-2 border-skin-terracotta border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs uppercase tracking-wider text-skin-charcoal/60">
              Retrieving your orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
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
                key={order.orderNumber || order.id || order._id}
                className="bg-white border border-skin-sand/35 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6"
              >
                {/* Header */}
                <div className="flex flex-wrap justify-between items-center gap-4 border-b border-skin-sand/20 pb-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-skin-charcoal/50">
                      Order Reference
                    </p>
                    <p className="text-sm font-semibold text-skin-charcoal">
                      {order.orderNumber || order.id}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-skin-charcoal/50">
                      Date Placed
                    </p>
                    <p className="text-sm font-semibold text-skin-charcoal">
                      {new Date(order.date || order.createdAt || Date.now()).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider font-bold border shadow-sm ${getStatusBadge(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus || "Pending"}
                    </span>

                    {/* Payment Badge */}
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider font-bold shadow-sm ${
                        order.customer?.paymentMethod === "cod"
                          ? "bg-skin-sand text-skin-charcoal"
                          : "bg-skin-sage text-white"
                      }`}
                    >
                      {order.customer?.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : "Paid via Gateway"}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-skin-cream/20 border border-skin-sand/20 p-4 rounded-xl space-y-2">
                  <p className="text-xs uppercase tracking-widest font-bold text-skin-charcoal">
                    Shipping Information
                  </p>
                  <div className="text-xs text-skin-charcoal/80 space-y-1 font-sans">
                    <p className="font-medium text-skin-charcoal">
                      {order.customer?.name}
                    </p>
                    <p>{order.customer?.phone}</p>
                    <p>{order.customer?.address}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-widest font-bold text-skin-charcoal">
                    Ordered Ritual Items
                  </p>
                  <div className="divide-y divide-skin-sand/20">
                    {order.items?.map((item, idx) => (
                      <div
                        key={item.id || item._id || idx}
                        className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              item.images?.[0] ||
                              (Array.isArray(item.images) ? item.images[0] : null) ||
                              "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=300&q=80"
                            }
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover bg-skin-cream/40 border border-skin-sand/20"
                          />
                          <div>
                            <p className="text-xs font-semibold text-skin-charcoal">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-skin-charcoal/50 uppercase tracking-wider mt-0.5">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs font-bold text-skin-charcoal">
                          $
                          {(
                            Number(item.price || 0) * Number(item.quantity || 1)
                          ).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals & Actions */}
                <div className="border-t border-skin-sand/20 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                  <div>
                    {order.orderStatus === "pending" && (
                      <button
                        onClick={() =>
                          handleCancelOrder(order._id || order.orderNumber)
                        }
                        className="text-xs text-red-500 hover:text-red-700 underline uppercase tracking-wider font-semibold"
                      >
                        Cancel This Order
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5 w-full sm:max-w-xs text-xs uppercase tracking-wider text-skin-charcoal/60">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-skin-charcoal">
                        ${Number(order.subtotal || 0).toFixed(2)}
                      </span>
                    </div>

                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-600 font-semibold">
                        <span>Discount</span>
                        <span>-${Number(order.discount || 0).toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span className="font-semibold text-skin-charcoal">
                        ${Number(order.deliveryFee || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm uppercase tracking-wider font-bold border-t border-skin-sand/20 pt-3 text-skin-charcoal">
                      <span>Total Amount</span>
                      <span className="text-md text-skin-terracotta font-bold">
                        ${Number(order.total || 0).toFixed(2)}
                      </span>
                    </div>
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
