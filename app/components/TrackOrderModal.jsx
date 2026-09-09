"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiPackage, FiTruck, FiCheckCircle, FiClock, FiArrowRight, FiSearch } from "react-icons/fi";
import Link from "next/link";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function TrackOrderModal({ isOpen, onClose }) {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const handleTrack = async (e) => {
    e?.preventDefault();
    const id = orderId.trim();
    if (!id) {
      setError("Please enter a valid Order ID");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await api.get(`/orders/${id}`);
      if (res.data?.success && res.data?.order) {
        setOrder(res.data.order);
      } else if (res.data?._id) {
        setOrder(res.data);
      } else {
        setError("No order found with this tracking ID. Please check and try again.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Order not found. Please verify the ID or check My Orders if you were signed in."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "cancelled") return -1;
    if (s === "delivered") return 3;
    if (s === "shipped") return 2;
    return 1; // default processing/placed
  };

  if (!isOpen) return null;

  const currentStep = order ? getStepStatus(order.orderStatus || order.status) : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-skin-charcoal/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-skin-sand/60 overflow-hidden z-10"
        >
          {/* Top Decorative Line */}
          <div className="h-1 w-full bg-gradient-to-r from-skin-sand via-skin-terracotta to-skin-sand" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-skin-sand/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-skin-terracotta/10 text-skin-terracotta flex items-center justify-center">
                <FiTruck size={17} />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-skin-charcoal tracking-wide">
                  Track Your Ritual
                </h3>
                <p className="text-[11px] text-skin-charcoal/50 font-light">
                  Follow your skincare package every step of the way
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close track order modal"
              className="w-8 h-8 rounded-lg text-skin-charcoal/40 hover:text-skin-charcoal hover:bg-skin-sand/50 transition-colors flex items-center justify-center"
            >
              <FiX size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Input Form */}
            <form onSubmit={handleTrack} className="space-y-3">
              <label className="block text-[11px] uppercase tracking-[0.16em] font-semibold text-skin-charcoal/70">
                Order ID / Tracking Number
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FiSearch
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-skin-charcoal/40"
                  />
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. 66f123... or order ID"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-skin-cream/60 border border-skin-sand rounded-xl text-xs text-skin-charcoal placeholder-skin-charcoal/35 outline-none focus:border-skin-terracotta focus:ring-2 focus:ring-skin-terracotta/10 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-skin-charcoal text-white rounded-xl text-xs font-semibold tracking-wider hover:bg-skin-terracotta transition-colors disabled:opacity-50 shrink-0 flex items-center gap-1.5"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Track</span>
                      <FiArrowRight size={13} />
                    </>
                  )}
                </button>
              </div>
              {error && (
                <p className="text-xs text-red-500 bg-red-50/80 px-3 py-2 rounded-lg border border-red-100">
                  {error}
                </p>
              )}
            </form>

            {/* Order Result Card */}
            {order && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-skin-cream/50 rounded-xl p-4 border border-skin-sand/50 space-y-4"
              >
                <div className="flex items-center justify-between text-xs pb-3 border-b border-skin-sand/40">
                  <div>
                    <span className="text-[10px] uppercase text-skin-charcoal/50 block font-medium">
                      Order Reference
                    </span>
                    <span className="font-mono font-semibold text-skin-charcoal">
                      #{order._id?.slice(-8).toUpperCase() || orderId}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-skin-charcoal/50 block font-medium">
                      Status
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-skin-terracotta capitalize">
                      {order.orderStatus || order.status || "Processing"}
                    </span>
                  </div>
                </div>

                {/* Progress Stepper */}
                <div className="py-2">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-skin-sand -translate-y-1/2 z-0" />
                    <div
                      className="absolute top-1/2 left-0 h-0.5 bg-skin-terracotta -translate-y-1/2 z-0 transition-all duration-500"
                      style={{
                        width:
                          currentStep === 1
                            ? "25%"
                            : currentStep === 2
                            ? "66%"
                            : currentStep >= 3
                            ? "100%"
                            : "0%",
                      }}
                    />

                    {[
                      { title: "Placed", icon: FiClock, step: 1 },
                      { title: "Dispatched", icon: FiTruck, step: 2 },
                      { title: "Delivered", icon: FiCheckCircle, step: 3 },
                    ].map((s) => {
                      const Icon = s.icon;
                      const isComplete = currentStep >= s.step;
                      const isCurrent = currentStep === s.step;
                      return (
                        <div
                          key={s.title}
                          className="relative z-10 flex flex-col items-center bg-transparent"
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors duration-300 border-2 ${
                              isComplete
                                ? "bg-skin-terracotta border-skin-terracotta text-white shadow-sm"
                                : "bg-white border-skin-sand text-skin-charcoal/30"
                            }`}
                          >
                            <Icon size={12} />
                          </div>
                          <span
                            className={`text-[10px] mt-1.5 font-medium tracking-wide ${
                              isCurrent
                                ? "text-skin-terracotta font-bold"
                                : isComplete
                                ? "text-skin-charcoal font-semibold"
                                : "text-skin-charcoal/40"
                            }`}
                          >
                            {s.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Products mini preview */}
                {order.orderItems && order.orderItems.length > 0 && (
                  <div className="pt-2 border-t border-skin-sand/30">
                    <span className="text-[10px] uppercase text-skin-charcoal/50 block font-medium mb-1.5">
                      Items in Package ({order.orderItems.length})
                    </span>
                    <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                      {order.orderItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-[11px] text-skin-charcoal/80"
                        >
                          <span className="truncate max-w-[200px]">{item.name}</span>
                          <span className="text-skin-charcoal/50 font-mono">
                            Qty: {item.quantity} · Rs. {item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Logged in helper / My Orders shortcut */}
            {user ? (
              <div className="pt-2 flex items-center justify-between border-t border-skin-sand/30 text-xs">
                <span className="text-skin-charcoal/60">Signed in as {user.name}</span>
                <Link
                  href="/my-orders"
                  onClick={onClose}
                  className="font-semibold text-skin-terracotta hover:underline flex items-center gap-1"
                >
                  <FiPackage size={13} />
                  View All Orders
                </Link>
              </div>
            ) : (
              <div className="pt-2 text-center text-xs text-skin-charcoal/60 border-t border-skin-sand/30">
                <span>Already have an account? </span>
                <Link
                  href="/login"
                  onClick={onClose}
                  className="font-semibold text-skin-terracotta hover:underline"
                >
                  Sign in
                </Link>
                <span> to view complete purchase history.</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
