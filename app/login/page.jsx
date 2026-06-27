import React from "react";
import { FcGoogle } from "react-icons/fc";

const login = () => {
  return (
    <div className="px-6 py-28 flex justify-center items-center bg-skin-cream/10 min-h-screen">
      <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-2xl border border-skin-sand/35 shadow-sm lg:max-w-4xl">
        {/* Left-side image */}
        <div
          className="hidden bg-cover lg:block lg:w-1/2"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/3736397/pexels-photo-3736397.jpeg')",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Right-side form */}
        <div className="w-full px-6 py-10 md:px-10 lg:w-1/2 flex flex-col justify-center">
          {/* Logo */}
          <div className="text-center mb-6">
            <h2 className="text-3xl tracking-widest font-serif text-skin-charcoal">
              SKINAURA
            </h2>
            <p className="mt-2 text-xs uppercase tracking-wider text-skin-charcoal/50">
              Welcome back to your skin ritual
            </p>
          </div>

          {/* Google Sign-in */}
          <a
            href="#"
            className="flex items-center justify-center mt-4 border border-skin-sand rounded-xl hover:bg-skin-sand/20 transition-all duration-300"
          >
            <div className="px-4 py-2 border-r border-skin-sand">
              <FcGoogle className="w-5 h-5" />
            </div>
            <span className="w-5/6 text-xs uppercase tracking-widest font-bold text-skin-charcoal text-center">
              Sign in with Google
            </span>
          </a>

          {/* Divider */}
          <div className="flex items-center justify-between mt-6">
            <span className="w-1/4 border-b border-skin-sand/60"></span>
            <span className="text-[10px] text-center text-skin-charcoal/40 uppercase tracking-widest">
              or login with email
            </span>
            <span className="w-1/4 border-b border-skin-sand/60"></span>
          </div>

          {/* Email Input */}
          <div className="mt-6 space-y-1.5">
            <label
              htmlFor="LoggingEmailAddress"
              className="text-[11px] uppercase tracking-wider font-bold text-skin-charcoal/60"
            >
              Email Address
            </label>
            <input
              id="LoggingEmailAddress"
              type="email"
              placeholder="name@example.com"
              className="block w-full px-4 py-3 text-sm text-skin-charcoal bg-skin-cream/10 border border-skin-sand rounded-xl focus:border-skin-sage focus:ring-1 focus:ring-skin-sage focus:outline-none"
            />
          </div>

          {/* Password Input */}
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between items-center">
              <label
                htmlFor="loggingPassword"
                className="text-[11px] uppercase tracking-wider font-bold text-skin-charcoal/60"
              >
                Password
              </label>
              <a href="#" className="text-[10px] uppercase tracking-wider text-skin-terracotta hover:underline">
                Forgot?
              </a>
            </div>
            <input
              id="loggingPassword"
              type="password"
              placeholder="••••••••"
              className="block w-full px-4 py-3 text-sm text-skin-charcoal bg-skin-cream/10 border border-skin-sand rounded-xl focus:border-skin-sage focus:ring-1 focus:ring-skin-sage focus:outline-none"
            />
          </div>

          {/* Sign-in Button */}
          <div className="mt-8">
            <button className="w-full px-6 py-3.5 text-xs uppercase tracking-widest font-bold text-white bg-skin-charcoal rounded-xl hover:bg-skin-sage transition-all duration-300 shadow-md">
              Sign In
            </button>
          </div>

          {/* Sign-up Link */}
          <div className="flex items-center justify-between mt-6">
            <span className="w-1/5 border-b border-skin-sand/40"></span>
            <a
              href="#"
              className="text-[10px] uppercase tracking-widest text-skin-charcoal/50 hover:text-skin-terracotta hover:underline"
            >
              or create account
            </a>
            <span className="w-1/5 border-b border-skin-sand/40"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default login;
