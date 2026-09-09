"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  FiMail,
  FiLock,
  FiUser,
  FiArrowRight,
  FiCheckCircle,
  FiShield,
} from "react-icons/fi";
import Link from "next/link";

const LoginPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const { login, register, loginWithGoogle, user } = useAuth();

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
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

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

  const handleGoogleAuth = async () => {
    setError("");
    setSuccessMsg("");
    setGoogleSubmitting(true);

    try {
      // Customer sign-in/registration via Google
      const loggedUser = await loginWithGoogle("customer");
      setSuccessMsg(`Welcome, ${loggedUser.name}!`);
      setTimeout(() => {
        if (loggedUser?.role === "admin") {
          router.push("/admin");
        } else {
          router.push(redirectUrl);
        }
      }, 500);
    } catch (err) {
      setError(err.message || "Google authentication failed.");
    } finally {
      setGoogleSubmitting(false);
    }
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

        // Customer registration only
        const registeredUser = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "customer",
        });
        setSuccessMsg("Account created successfully!");
        setTimeout(() => {
          router.push(redirectUrl);
        }, 500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Authentication failed. Please check your credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 md:px-6 py-20 flex justify-center items-center bg-[#FAF7F2]/50 min-h-screen">
      <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-3xl border border-skin-sand/60 shadow-xl lg:max-w-4xl">
        {/* Left-side luxury banner */}
        <div
          className="hidden bg-cover bg-center lg:block lg:w-1/2 relative"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/3736397/pexels-photo-3736397.jpeg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-skin-charcoal/90 via-skin-charcoal/30 to-transparent flex flex-col justify-end p-10 text-white">
            <span className="text-xs uppercase tracking-[0.25em] text-skin-sand font-semibold">
              Pure Botanical Luxury
            </span>
            <h3 className="text-3xl font-serif mt-2 leading-snug">
              Elevate your daily ritual with conscious skincare.
            </h3>
            <p className="text-xs text-white/75 mt-3 leading-relaxed font-light">
              Join our community of mindful beauty enthusiasts and receive tailored routine recommendations and order tracking.
            </p>
          </div>
        </div>

        {/* Right-side form */}
        <div className="w-full px-6 py-10 md:px-10 lg:w-1/2 flex flex-col justify-center">
          {/* Brand Heading */}
          <div className="text-center mb-6">
            <h2 className="text-3xl tracking-[0.2em] font-serif text-skin-charcoal font-medium">
              SKIN-AURA
            </h2>
            <p className="mt-1.5 text-xs uppercase tracking-wider text-skin-charcoal/50">
              {mode === "login"
                ? "Sign in to access your orders & ritual"
                : "Create your customer account"}
            </p>
          </div>

          {/* Mode Switch Tabs (Sign In / Create Account) */}
          <div className="grid grid-cols-2 p-1 bg-skin-cream/40 border border-skin-sand/60 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer ${
                mode === "login"
                  ? "bg-white text-skin-charcoal shadow-xs"
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
              className={`py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer ${
                mode === "register"
                  ? "bg-white text-skin-charcoal shadow-xs"
                  : "text-skin-charcoal/60 hover:text-skin-charcoal"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* ── GOOGLE SIGN-IN BUTTON FOR CUSTOMERS ── */}
          <div className="mb-5">
            <button
              type="button"
              disabled={googleSubmitting}
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-skin-sand/90 bg-white hover:bg-skin-sand/30 text-skin-charcoal text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {/* Google Brand Color SVG */}
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
                {googleSubmitting ? "Connecting with Google..." : "Continue with Google"}
              </span>
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-skin-sand/60" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-white px-2 text-skin-charcoal/40 font-semibold">
                  Or continue with email
                </span>
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

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === "register" && (
              <div className="space-y-1">
                <label className="text-[10.5px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-3.5 text-skin-charcoal/40" size={14} />
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    required
                    className="block w-full pl-9 pr-4 py-2.5 text-xs text-skin-charcoal bg-skin-cream/20 border border-skin-sand rounded-xl focus:border-skin-terracotta focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10.5px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3.5 text-skin-charcoal/40" size={14} />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className="block w-full pl-9 pr-4 py-2.5 text-xs text-skin-charcoal bg-skin-cream/20 border border-skin-sand rounded-xl focus:border-skin-terracotta focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10.5px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-skin-charcoal/40" size={14} />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="block w-full pl-9 pr-4 py-2.5 text-xs text-skin-charcoal bg-skin-cream/20 border border-skin-sand rounded-xl focus:border-skin-terracotta focus:outline-none"
                />
              </div>
            </div>

            {mode === "register" && (
              <div className="space-y-1">
                <label className="text-[10.5px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-3.5 text-skin-charcoal/40" size={14} />
                  <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="block w-full pl-9 pr-4 py-2.5 text-xs text-skin-charcoal bg-skin-cream/20 border border-skin-sand rounded-xl focus:border-skin-terracotta focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-3 flex items-center justify-center gap-2 px-6 py-3 text-xs uppercase tracking-widest font-bold text-white bg-skin-charcoal rounded-xl hover:bg-skin-terracotta transition-all duration-300 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
                  <FiArrowRight size={13} />
                </>
              )}
            </button>
          </form>

          {/* Bottom toggle between Login & Register */}
          <div className="text-center mt-5">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
              className="text-xs text-skin-charcoal/60 hover:text-skin-terracotta transition-colors cursor-pointer"
            >
              {mode === "login"
                ? "Don't have an account? Create one"
                : "Already have an account? Sign in"}
            </button>
          </div>

          {/* Dedicated Administrator Portal Link */}
          <div className="text-center mt-4 pt-4 border-t border-skin-sand/40">
            <Link
              href="/admin/login"
              className="text-[11px] font-semibold text-skin-charcoal/50 hover:text-skin-terracotta transition-colors inline-flex items-center gap-1.5"
            >
              <FiShield size={12} className="text-skin-terracotta" />
              <span>Store Administrator? Sign In to Admin Portal →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-skin-cream/40">
          <div className="w-8 h-8 border-2 border-skin-terracotta border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
