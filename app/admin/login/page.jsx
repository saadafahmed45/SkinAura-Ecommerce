"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiShield, FiLock, FiMail, FiArrowRight, FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { useAuth } from "../../context/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, user, isAdmin, logout } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // If already authenticated as admin, redirect directly into dashboard
  useEffect(() => {
    if (user) {
      if (isAdmin) {
        router.replace("/admin");
      } else {
        setError(
          `Logged in as ${user.email}, but this account does not have administrator privileges.`
        );
      }
    }
  }, [user, isAdmin, router]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        setError("Please enter your administrator email and password.");
        setLoading(false);
        return;
      }

      const loggedUser = await login(formData.email, formData.password);

      if (loggedUser.role !== "admin") {
        await logout();
        setError("Access Denied: This account does not possess administrator privileges.");
        setLoading(false);
        return;
      }

      router.replace("/admin");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Authentication failed. Please verify your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAdminLogin = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      // Authenticate with Google
      const loggedUser = await loginWithGoogle("admin");

      if (loggedUser.role !== "admin") {
        await logout();
        setError(
          `Access Denied: Google account (${loggedUser.email}) is registered as a customer and cannot access the admin control center.`
        );
        setGoogleLoading(false);
        return;
      }

      router.replace("/admin");
    } catch (err) {
      setError(err?.message || "Google authentication failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setFormData({
      email: "admin@skinaura.com",
      password: "AdminPassword123!",
    });
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#1E1D1A] text-white flex flex-col justify-between px-4 py-8 sm:py-12">
      {/* Top Bar */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-skin-terracotta/20 flex items-center justify-center text-skin-terracotta border border-skin-terracotta/40">
            <HiSparkles size={16} />
          </div>
          <span className="text-sm font-serif font-semibold tracking-[0.22em] text-white">
            SKIN-AURA
          </span>
        </div>

        <Link
          href="/"
          className="text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <FiArrowLeft size={13} />
          <span>Storefront</span>
        </Link>
      </div>

      {/* Main Form Container */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-[#272622] rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-skin-terracotta/15 text-skin-terracotta border border-skin-terracotta/30 flex items-center justify-center mx-auto shadow-inner">
              <FiShield size={22} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-medium text-white tracking-wide">
              Administrator Portal
            </h1>
            <p className="text-[11px] uppercase tracking-[0.16em] text-skin-terracotta font-semibold">
              Restricted Access · Authorized Personnel Only
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-900/30 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
              <FiAlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          {/* Google Sign-In as Admin */}
          <button
            type="button"
            disabled={googleLoading}
            onClick={handleGoogleAdminLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {/* Google SVG Logo */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>
              {googleLoading ? "Verifying Google Credentials..." : "Sign In with Google (Admin)"}
            </span>
          </button>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.16em]">
              <span className="bg-[#272622] px-3 text-white/40 font-semibold">
                Or sign in with email
              </span>
            </div>
          </div>

          {/* Admin Email & Password Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-[0.16em] font-semibold text-white/70">
                Administrator Email
              </label>
              <div className="relative">
                <FiMail size={15} className="absolute left-3.5 top-3.5 text-white/40" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@skinaura.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/15 rounded-xl text-xs text-white placeholder-white/25 outline-none focus:border-skin-terracotta focus:ring-1 focus:ring-skin-terracotta transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-[0.16em] font-semibold text-white/70">
                Password
              </label>
              <div className="relative">
                <FiLock size={15} className="absolute left-3.5 top-3.5 text-white/40" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/15 rounded-xl text-xs text-white placeholder-white/25 outline-none focus:border-skin-terracotta focus:ring-1 focus:ring-skin-terracotta transition-all"
                />
              </div>
            </div>

            {/* Demo Auto-fill Helper */}
            <div className="flex items-center justify-between text-[11px] pt-1 text-white/50">
              <span>Quick Demo Access:</span>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="text-skin-terracotta hover:underline font-semibold cursor-pointer"
              >
                Auto-fill Admin Account
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl text-xs uppercase tracking-[0.2em] font-bold text-white bg-skin-terracotta hover:bg-skin-terracotta/90 transition-all duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate & Enter Dashboard</span>
                  <FiArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-xs text-white/40 font-light">
            Looking for customer shopping and orders?
          </p>
          <Link
            href="/login"
            className="inline-block text-xs font-semibold text-skin-sand hover:text-white transition-colors"
          >
            Go to Customer Login & Registration →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center text-[10px] text-white/30 tracking-widest uppercase">
        © {new Date().getFullYear()} Skin-Aura Management Console. All rights reserved.
      </div>
    </div>
  );
}
