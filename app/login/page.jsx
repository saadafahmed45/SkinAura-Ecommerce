"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiLock, FiUser, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const { login, register, user } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push(redirectUrl);
      }
    }
  }, [user, router, redirectUrl]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setSubmitting(true);

    try {
      if (mode === "login") {
        if (!formData.email || !formData.password) {
          setError("Please provide both email and password.");
          setSubmitting(false);
          return;
        }
        const loggedInUser = await login(formData.email, formData.password);
        setSuccessMsg("Welcome back!");
        setTimeout(() => {
          if (loggedInUser?.role === "admin") {
            router.push("/admin");
          } else {
            router.push(redirectUrl);
          }
        }, 500);
      } else {
        if (!formData.name || !formData.email || !formData.password) {
          setError("Please complete all required fields.");
          setSubmitting(false);
          return;
        }
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters long.");
          setSubmitting(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          setSubmitting(false);
          return;
        }
        const registeredUser = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        setSuccessMsg("Account created successfully!");
        setTimeout(() => {
          if (registeredUser?.role === "admin") {
            router.push("/admin");
          } else {
            router.push(redirectUrl);
          }
        }, 500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Authentication failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (role) => {
    if (role === "admin") {
      setFormData({
        name: "Admin User",
        email: "admin@skinaura.com",
        password: "AdminPassword123!",
        confirmPassword: "AdminPassword123!",
      });
      setMode("login");
    } else {
      setFormData({
        name: "Customer User",
        email: "customer@skinaura.com",
        password: "CustomerPassword123!",
        confirmPassword: "CustomerPassword123!",
      });
      setMode("login");
    }
    setError("");
  };

  return (
    <div className="px-4 md:px-6 py-24 flex justify-center items-center bg-skin-cream/10 min-h-screen">
      <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-3xl border border-skin-sand/35 shadow-xl lg:max-w-4xl">
        {/* Left-side image */}
        <div
          className="hidden bg-cover bg-center lg:block lg:w-1/2 relative"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/3736397/pexels-photo-3736397.jpeg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-skin-charcoal/80 via-skin-charcoal/20 to-transparent flex flex-col justify-end p-10 text-white">
            <span className="text-xs uppercase tracking-[0.25em] text-skin-sand font-semibold">
              Pure Botanical Luxury
            </span>
            <h3 className="text-3xl font-serif mt-2 leading-snug">
              Elevate your daily ritual with conscious skincare.
            </h3>
            <p className="text-xs text-white/75 mt-3 leading-relaxed font-light">
              Join our community of mindful beauty enthusiasts and receive personalized routine recommendations.
            </p>
          </div>
        </div>

        {/* Right-side form */}
        <div className="w-full px-6 py-10 md:px-10 lg:w-1/2 flex flex-col justify-center">
          {/* Logo & Heading */}
          <div className="text-center mb-6">
            <h2 className="text-3xl tracking-widest font-serif text-skin-charcoal">
              SKINAURA
            </h2>
            <p className="mt-2 text-xs uppercase tracking-wider text-skin-charcoal/50">
              {mode === "login" ? "Welcome back to your skin ritual" : "Begin your skin ritual journey"}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 p-1 bg-skin-cream/30 border border-skin-sand/40 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-200 ${
                mode === "login"
                  ? "bg-white text-skin-charcoal shadow-sm"
                  : "text-skin-charcoal/60 hover:text-skin-charcoal"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-200 ${
                mode === "register"
                  ? "bg-white text-skin-charcoal shadow-sm"
                  : "text-skin-charcoal/60 hover:text-skin-charcoal"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Quick Demo Credentials Buttons */}
          <div className="mb-6 p-3 bg-skin-cream/20 rounded-2xl border border-skin-sand/30 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-skin-charcoal/50">
                Demo Auto-Fill:
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo("customer")}
                  className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-skin-sand/40 hover:bg-skin-sand text-skin-charcoal transition"
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo("admin")}
                  className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-skin-terracotta/15 hover:bg-skin-terracotta/25 text-skin-terracotta transition"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2">
              <FiCheckCircle size={14} />
              {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-3.5 text-skin-charcoal/40" size={15} />
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    required
                    className="block w-full pl-10 pr-4 py-3 text-sm text-skin-charcoal bg-skin-cream/10 border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:ring-1 focus:ring-skin-terracotta focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3.5 text-skin-charcoal/40" size={15} />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className="block w-full pl-10 pr-4 py-3 text-sm text-skin-charcoal bg-skin-cream/10 border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:ring-1 focus:ring-skin-terracotta focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                  Password
                </label>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-skin-charcoal/40" size={15} />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="block w-full pl-10 pr-4 py-3 text-sm text-skin-charcoal bg-skin-cream/10 border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:ring-1 focus:ring-skin-terracotta focus:outline-none"
                />
              </div>
            </div>

            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-3.5 text-skin-charcoal/40" size={15} />
                  <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="block w-full pl-10 pr-4 py-3 text-sm text-skin-charcoal bg-skin-cream/10 border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:ring-1 focus:ring-skin-terracotta focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3.5 text-xs uppercase tracking-widest font-bold text-white bg-skin-charcoal rounded-xl hover:bg-skin-terracotta transition-all duration-300 shadow-md disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>{mode === "login" ? "Sign In" : "Register Now"}</span>
                  <FiArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Bottom Switch Note */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
              className="text-xs text-skin-charcoal/60 hover:text-skin-terracotta transition-colors"
            >
              {mode === "login"
                ? "Don't have an account? Create one"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
