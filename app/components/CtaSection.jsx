"use client";
import React, { useState } from "react";
import { FiArrowRight, FiCheck } from "react-icons/fi";

const CtaSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="relative overflow-hidden bg-skin-charcoal py-24 px-6">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-skin-terracotta/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-skin-sage/10 blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center relative z-10 space-y-7">
        <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-skin-terracotta font-bold">
          <span className="w-6 h-px bg-skin-terracotta" />
          Join the Community
          <span className="w-6 h-px bg-skin-terracotta" />
        </span>

        <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">
          Unlock 10% Off{" "}
          <span className="italic font-light text-skin-sand">
            Your First Ritual
          </span>
        </h2>

        <p className="text-sm text-white/55 max-w-lg mx-auto font-light leading-relaxed">
          Subscribe to the SkinAura Journal to receive expert skincare advice,
          new product launches, and exclusive member-only offers.
        </p>

        {/* Perks */}
        <div className="flex flex-wrap justify-center gap-4 text-[11px] text-white/55">
          {["No spam, ever", "Cancel anytime", "Exclusive deals"].map((p) => (
            <div key={p} className="flex items-center gap-1.5">
              <FiCheck size={11} className="text-skin-terracotta" />
              {p}
            </div>
          ))}
        </div>

        {/* Form */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mt-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full sm:flex-1 px-5 py-3.5 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:border-skin-sand focus:outline-none text-white placeholder-white/35 transition-colors duration-300"
            />
            <button
              type="submit"
              className="group w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 text-[11px] uppercase tracking-[0.18em] font-bold bg-skin-terracotta text-white rounded-2xl hover:bg-skin-terracotta/90 transition-all duration-300 shadow-xl shadow-skin-terracotta/30 whitespace-nowrap"
            >
              Subscribe
              <FiArrowRight
                size={13}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-14 h-14 rounded-full bg-skin-sage/20 border border-skin-sage/40 flex items-center justify-center">
              <FiCheck size={24} className="text-skin-sage" />
            </div>
            <p className="text-white font-semibold text-sm">
              You're in! Check your inbox for your 10% off code.
            </p>
          </div>
        )}

        <p className="text-[10px] text-white/30">
          By signing up, you consent to our privacy policy and can unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

export default CtaSection;
