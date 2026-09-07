"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "../lib/api";
import {
  FiDollarSign,
  FiShoppingBag,
  FiBox,
  FiUsers,
  FiAlertTriangle,
  FiClock,
  FiCheckCircle,
  FiArrowRight,
  FiRefreshCw,
} from "react-icons/fi";
import DashboardCharts from "./components/DashboardCharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      if (res.data?.success && res.data?.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-skin-terracotta border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const kpis = [
    {
      label: "Total Sales",
      value: `$${stats?.totalSales?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "0.00"}`,
      sub: `${stats?.totalOrders || 0} Total Orders`,
      icon: FiDollarSign,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Orders",
      value: stats?.totalOrders || 0,
      sub: `${stats?.pendingOrders || 0} Pending dispatch`,
      icon: FiShoppingBag,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Catalog",
      value: stats?.totalProducts || 0,
      sub: `${stats?.lowStockCount || 0} Low in inventory`,
      icon: FiBox,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Registered Users",
      value: stats?.totalCustomers || 0,
      sub: "Active customers",
      icon: FiUsers,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-skin-terracotta">
            Dashboard Overview
          </span>
          <h1 className="text-2xl md:text-3xl font-serif text-skin-charcoal mt-1">
            SkinAura Control Center
          </h1>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-skin-sand/50 rounded-xl text-xs font-semibold text-skin-charcoal hover:bg-skin-cream/20 transition self-start"
        >
          <FiRefreshCw className={refreshing ? "animate-spin" : ""} size={13} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-skin-sand/35 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-skin-charcoal/50">
                  {kpi.label}
                </span>
                <div className={`p-2.5 rounded-xl ${kpi.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-skin-charcoal">
                  {kpi.value}
                </h3>
                <p className="text-[11px] text-skin-charcoal/60 mt-1">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics & Performance Graphs */}
      <DashboardCharts stats={stats} />

      {/* Low Stock Warning Banner if applicable */}
      {stats?.lowStockProducts && stats.lowStockProducts.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/80 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <FiAlertTriangle size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Low Inventory Alert
              </h4>
              <p className="text-xs text-amber-700/80 mt-0.5">
                {stats.lowStockProducts.length} items have 5 or fewer units left in stock.
              </p>
            </div>
          </div>
          <Link
            href="/admin/products"
            className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/60 hover:bg-amber-200 px-4 py-2 rounded-xl transition self-start md:self-auto"
          >
            Manage Inventory
          </Link>
        </div>
      )}

      {/* Two Column Grid: Recent Orders & Top Selling */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table (2 cols on large) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-skin-sand/35 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-serif font-semibold text-skin-charcoal">
                Recent Orders
              </h3>
              <p className="text-xs text-skin-charcoal/50">Latest customer purchases</p>
            </div>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-skin-terracotta hover:underline"
            >
              <span>View All</span>
              <FiArrowRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-skin-sand/30 text-skin-charcoal/50 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Order</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-skin-sand/20">
                {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => {
                    const statusColor = {
                      pending: "bg-amber-100 text-amber-800",
                      processing: "bg-blue-100 text-blue-800",
                      shipped: "bg-purple-100 text-purple-800",
                      delivered: "bg-emerald-100 text-emerald-800",
                      cancelled: "bg-red-100 text-red-800",
                    }[order.orderStatus] || "bg-gray-100 text-gray-800";

                    return (
                      <tr key={order._id} className="hover:bg-skin-cream/20">
                        <td className="py-3.5 font-mono font-medium text-skin-charcoal">
                          {order.orderNumber}
                        </td>
                        <td className="py-3.5 text-skin-charcoal font-medium">
                          {order.customer?.name || "Customer"}
                        </td>
                        <td className="py-3.5 font-semibold text-skin-charcoal">
                          ${order.total?.toFixed(2)}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor}`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="py-3.5 text-skin-charcoal/60">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-skin-charcoal/40">
                      No orders placed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products / Low Stock Column */}
        <div className="bg-white rounded-3xl border border-skin-sand/35 shadow-sm p-6 space-y-5">
          <div>
            <h3 className="text-lg font-serif font-semibold text-skin-charcoal">
              Top Selling Formulas
            </h3>
            <p className="text-xs text-skin-charcoal/50">Most popular active formulations</p>
          </div>

          <div className="space-y-4">
            {stats?.topSellingProducts && stats.topSellingProducts.length > 0 ? (
              stats.topSellingProducts.map((p, idx) => (
                <div key={p._id || idx} className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-skin-cream/40 border border-skin-sand/30 overflow-hidden flex-shrink-0">
                    <img
                      src={p.images?.[0] || "https://images.pexels.com/photos/3736397/pexels-photo-3736397.jpeg"}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-skin-charcoal truncate">
                      {p.name}
                    </h4>
                    <p className="text-[10px] text-skin-charcoal/50 uppercase tracking-wider mt-0.5">
                      {p.category}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-skin-charcoal">
                      ${p.price}
                    </span>
                    <p className="text-[10px] text-skin-terracotta font-semibold">
                      {p.sold || 0} sold
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-skin-charcoal/40 text-center py-6">
                Catalog data ready
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
