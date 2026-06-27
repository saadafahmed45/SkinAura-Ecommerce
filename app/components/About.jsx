import React from "react";
import Link from "next/link";

const About = () => {
  return (
    <section className="w-full py-20 bg-skin-cream border-t border-skin-sand/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-widest text-skin-terracotta font-bold">
            Our Story
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-skin-charcoal leading-tight">
            Cultivating Your <br />
            <span className="italic font-light">Natural Skin Aura</span>
          </h2>
          <p className="text-sm text-skin-charcoal/80 leading-relaxed font-light">
            At SkinAura, we believe skincare is more than a daily routine — it’s a gentle ritual of self-care and confidence. Our mission is simple: to help you embrace and enhance your natural glow with clean, dermatologically-inspired products.
          </p>
          <p className="text-sm text-skin-charcoal/80 leading-relaxed font-light">
            Every skin type is unique. That’s why we formulate targeted, high-performance skincare solutions crafted specifically for dry, oily, combination, and sensitive skin. We merge nature's finest botanicals with clinical actives to deliver visible, long-lasting radiance.
          </p>
          
          <div className="pt-4">
            <Link href="/about">
              <button className="px-6 py-3 border border-skin-charcoal text-skin-charcoal hover:bg-skin-charcoal hover:text-white text-xs uppercase tracking-widest font-semibold rounded-xl transition-all duration-300">
                Learn More
              </button>
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="flex justify-center relative">
          {/* Decorative Backing Block */}
          <div className="absolute top-4 -left-4 w-full h-full max-w-sm border border-skin-sand rounded-2xl -z-10"></div>
          <img
            src="https://images.pexels.com/photos/3762466/pexels-photo-3762466.jpeg"
            alt="Applying serum cream model"
            className="rounded-2xl shadow-xl w-full max-w-sm h-[450px] object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
