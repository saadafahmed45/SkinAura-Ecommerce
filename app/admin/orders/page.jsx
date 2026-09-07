"use client";

import React, { useState, useEffect } from "react";
import api from "../../lib/api";
import {
  FiSearch,
  FiEye,
  FiCheck,
  FiClock,
  FiTruck,
  FiXCircle,
  FiShoppingBag,
  FiX,
} from "react-icons/fi";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/admin/orders", {
        params: {
          status: statusFilter,
          search: search || undefined,
          limit: 50,
        },
      });
      if (res.data?.orders || res.data?.data) {
        setOrders(res.data.orders || res.data.data);
      }
    } catch (err) {
      console.error("Failed to load admin orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/admin/orders/${orderId}`, {
        orderStatus: newStatus,
        isDelivered: newStatus === "delivered",
      });

      setOrders((prev) =>
        prev.map((ord) =>
          ord._id === orderId ? { ...ord, orderStatus: newStatus } : ord
        )
      );

      if (activeOrder && activeOrder._id === orderId) {
        setActiveOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/admin/orders/${orderId}`, {
        paymentStatus: newPaymentStatus,
        isPaid: newPaymentStatus === "paid",
      });

      setOrders((prev) =>
        prev.map((ord) =>
          ord._id === orderId ? { ...ord, paymentStatus: newPaymentStatus } : ord
        )
      );

      if (activeOrder && activeOrder._id === orderId) {
        setActiveOrder((prev) => ({ ...prev, paymentStatus: newPaymentStatus }));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update payment status");
    } finally {
      setUpdatingId(null);
    }
  };

  const statuses = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-skin-terracotta">
            Fulfillment Center
          </span>
          <h1 className="text-2xl md:text-3xl font-serif text-skin-charcoal mt-1">
            Order Management
          </h1>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-3xl border border-skin-sand/35 shadow-sm space-y-4">
        <div className="flex flex-wrap gap-2 border-b border-skin-sand/30 pb-3">
          {statuses.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition ${
                statusFilter === tab.value
                  ? "bg-skin-charcoal text-white shadow-sm"
                  : "bg-skin-cream/20 text-skin-charcoal/70 hover:bg-skin-sand/30"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-3.5 text-skin-charcoal/40" size={15} />
            <input
              type="text"
              placeholder="Search by order #, customer name, phone..."
              value={search}
              onChange={(e) => setSearch}
              onInput={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-skin-cream/20 border border-skin-sand/50 rounded-xl focus:outline-none focus:border-skin-terracotta text-skin-charcoal"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-skin-charcoal hover:bg-skin-terracotta text-white rounded-xl text-xs uppercase tracking-wider font-bold transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-skin-sand/35 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-skin-sand/30 bg-skin-cream/20 text-skin-charcoal/60 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-6 font-semibold">Order #</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Items</th>
                <th className="py-3.5 px-4 font-semibold">Total</th>
                <th className="py-3.5 px-4 font-semibold">Payment</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-6 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-skin-sand/20">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-skin-charcoal/50">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-skin-charcoal/40">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => {
                  const statusColors = {
                    pending: "text-amber-800 bg-amber-50 border-amber-200",
                    processing: "text-blue-800 bg-blue-50 border-blue-200",
                    shipped: "text-purple-800 bg-purple-50 border-purple-200",
                    delivered: "text-emerald-800 bg-emerald-50 border-emerald-200",
                    cancelled: "text-red-800 bg-red-50 border-red-200",
                  }[ord.orderStatus] || "text-gray-800 bg-gray-50 border-gray-200";

                  return (
                    <tr key={ord._id} className="hover:bg-skin-cream/10 transition">
                      <td className="py-4 px-6 font-mono font-semibold text-skin-charcoal">
                        {ord.orderNumber}
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-skin-charcoal">{ord.customer?.name}</p>
                        <p className="text-[10px] text-skin-charcoal/50">{ord.customer?.phone}</p>
                      </td>
                      <td className="py-4 px-4 text-skin-charcoal/70">
                        {ord.items?.length || 0} items
                      </td>
                      <td className="py-4 px-4 font-bold text-skin-charcoal">
                        ${ord.total?.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={ord.paymentStatus || "pending"}
                          disabled={updatingId === ord._id}
                          onChange={(e) => handlePaymentStatusChange(ord._id, e.target.value)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-skin-cream/20 border border-skin-sand/50 text-skin-charcoal focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={ord.orderStatus}
                          disabled={updatingId === ord._id}
                          onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                          className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-xl border focus:outline-none cursor-pointer ${statusColors}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setActiveOrder(ord)}
                          className="p-2 text-skin-charcoal/70 hover:text-skin-charcoal hover:bg-skin-sand/30 rounded-lg transition"
                          title="View Details"
                        >
                          <FiEye size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {activeOrder && (
        <div className="fixed inset-0 bg-skin-charcoal/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-skin-sand/40 space-y-6">
            <div className="flex items-center justify-between border-b border-skin-sand/30 pb-4">
              <div>
                <h3 className="text-xl font-serif text-skin-charcoal">
                  Order Details: {activeOrder.orderNumber}
                </h3>
                <p className="text-[10px] uppercase tracking-wider text-skin-charcoal/50 mt-0.5">
                  Placed on {new Date(activeOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setActiveOrder(null)}
                className="p-2 text-skin-charcoal/50 hover:text-skin-charcoal rounded-xl"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-2 gap-4 bg-skin-cream/20 p-4 rounded-2xl border border-skin-sand/30 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-skin-charcoal/50">
                  Recipient
                </span>
                <p className="font-semibold text-skin-charcoal mt-1">
                  {activeOrder.customer?.name}
                </p>
                <p className="text-skin-charcoal/70">{activeOrder.customer?.email}</p>
                <p className="text-skin-charcoal/70">{activeOrder.customer?.phone}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-skin-charcoal/50">
                  Delivery Address
                </span>
                <p className="text-skin-charcoal mt-1">{activeOrder.shippingAddress?.street}</p>
                <p className="text-skin-charcoal/70">
                  {activeOrder.shippingAddress?.city}, {activeOrder.shippingAddress?.state}{" "}
                  {activeOrder.shippingAddress?.postalCode}
                </p>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                Formula Breakdown ({activeOrder.items?.length || 0} items)
              </span>
              <div className="divide-y divide-skin-sand/30 border border-skin-sand/30 rounded-2xl overflow-hidden">
                {activeOrder.items?.map((it, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {it.image && (
                        <img
                          src={it.image}
                          alt={it.name}
                          className="w-10 h-10 object-cover rounded-lg border border-skin-sand/40"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-skin-charcoal">{it.name}</p>
                        <p className="text-[10px] text-skin-charcoal/50">
                          Qty: {it.quantity} × ${it.price?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-skin-charcoal">
                      ${((it.quantity || 1) * (it.price || 0)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-skin-cream/10 p-4 rounded-2xl border border-skin-sand/30 space-y-2 text-xs">
              <div className="flex justify-between text-skin-charcoal/70">
                <span>Subtotal</span>
                <span>${activeOrder.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-skin-charcoal/70">
                <span>Shipping</span>
                <span>${activeOrder.shippingCost?.toFixed(2)}</span>
              </div>
              {activeOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-${activeOrder.discount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-skin-charcoal font-bold text-sm pt-2 border-t border-skin-sand/30">
                <span>Total</span>
                <span>${activeOrder.total?.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveOrder(null)}
                className="px-6 py-2.5 text-xs uppercase font-bold tracking-wider text-white bg-skin-charcoal hover:bg-skin-terracotta rounded-xl transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
