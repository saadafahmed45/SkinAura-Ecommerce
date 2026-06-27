"use client";
import React from "react";

const ContactSection = () => {
  return (
    <section className="bg-skin-cream/10 py-28 px-6 md:px-12 lg:px-20 min-h-screen">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-skin-terracotta font-bold">Get In Touch</span>
          <h1 className="text-4xl md:text-5xl font-serif text-skin-charcoal font-medium">
            We are Here to Help
          </h1>
          <p className="text-sm text-skin-charcoal/70 leading-relaxed font-light">
            Have questions about formulas, orders, or finding the perfect ritual for your skin type? Reach out to our skincare experts.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* LEFT SIDE — Contact Info */}
          <div className="space-y-10">
            <h2 className="text-2xl font-serif text-skin-charcoal font-semibold">
              Contact Channels
            </h2>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white border border-skin-sand rounded-xl shadow-sm text-skin-terracotta">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-skin-charcoal">Flagship Studio</h4>
                  <p className="text-sm text-skin-charcoal/80 mt-1 font-light font-sans">
                    Cecilia Chapman, 711-2880 Nulla St.<br />
                    Mankato, Mississippi 96522
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white border border-skin-sand rounded-xl shadow-sm text-skin-terracotta">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-skin-charcoal">Customer Hotline</h4>
                  <p className="text-sm text-skin-charcoal/80 mt-1 font-light font-sans">
                    (257) 563-7401
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white border border-skin-sand rounded-xl shadow-sm text-skin-terracotta">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-skin-charcoal">Email Inquiry</h4>
                  <p className="text-sm text-skin-charcoal/80 mt-1 font-light font-sans">
                    care@skinaura.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — FORM */}
          <div className="bg-white border border-skin-sand/35 p-8 rounded-2xl shadow-sm">
            <h3 className="text-lg font-serif font-semibold text-skin-charcoal mb-6">
              Write to Our Skincare Experts
            </h3>

            <form className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-bold text-skin-charcoal/60">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full border border-skin-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-skin-sage focus:ring-1 focus:ring-skin-sage bg-skin-cream/10 text-skin-charcoal placeholder-skin-charcoal/40"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-bold text-skin-charcoal/60">Email Address</label>
                <input
                  type="email"
                  placeholder="johndoe@example.com"
                  className="w-full border border-skin-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-skin-sage focus:ring-1 focus:ring-skin-sage bg-skin-cream/10 text-skin-charcoal placeholder-skin-charcoal/40"
                />
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-bold text-skin-charcoal/60">Message</label>
                <textarea
                  placeholder="How can we assist you with your skin routine?"
                  rows="5"
                  className="w-full border border-skin-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-skin-sage focus:ring-1 focus:ring-skin-sage bg-skin-cream/10 text-skin-charcoal placeholder-skin-charcoal/40"
                ></textarea>
              </div>

              {/* Button */}
              <button
                type="submit"
                onClick={(e) => e.preventDefault()}
                className="w-full px-6 py-3.5 mt-2 text-xs uppercase tracking-widest font-bold text-white bg-skin-charcoal rounded-xl hover:bg-skin-sage transition-all duration-300 shadow-md"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
