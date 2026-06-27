import React from "react";

const About = () => {
  return (
    <section className="bg-skin-cream/10 py-28 px-6 md:px-12 lg:px-20 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Banner Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-skin-terracotta font-bold">Who We Are</span>
          <h1 className="text-4xl md:text-6xl font-serif text-skin-charcoal font-medium leading-tight">
            Nurturing Natural <br />
            <span className="italic font-light">Skin Alchemy</span>
          </h1>
          <p className="text-sm text-skin-charcoal/70 leading-relaxed font-light">
            At SkinAura, we blend natural botanicals with clinical science to form premium skincare rituals that respect, recover, and celebrate your unique skin.
          </p>
        </div>

        {/* Story Section Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-serif text-skin-charcoal font-semibold">
              Glow Naturally, Shine Confidently
            </h2>

            <p className="text-sm text-skin-charcoal/80 leading-relaxed font-light font-sans">
              At <span className="font-semibold text-skin-charcoal">SkinAura</span>, we believe skincare is more than a simple daily checklist — it is a dedicated ritual of self-care and empowerment. Our creations are built to nourish and protect, allowing you to showcase your natural skin with confidence.
            </p>

            <p className="text-sm text-skin-charcoal/80 leading-relaxed font-light font-sans">
              Every individual’s skin has distinct needs. That is why we structure target-oriented solutions using dermatologically approved actives like Ceramides, Hyaluronic Acid, and Niacinamide, combined with organic botanicals. We guarantee visible outcomes while maintaining gentle daily application.
            </p>

            {/* Our Promise */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs uppercase tracking-widest font-bold text-skin-charcoal">
                Our Clean Promise
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-skin-charcoal/80 uppercase tracking-wider">
                <li className="flex items-center gap-2">
                  <span className="text-skin-terracotta">✦</span> Clean, non-toxic ingredients
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-skin-terracotta">✦</span> Science-backed formulations
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-skin-terracotta">✦</span> 100% Cruelty-free & Vegan
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-skin-terracotta">✦</span> Dermatologist approved
                </li>
              </ul>
            </div>
          </div>

          {/* Image */}
          <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-skin-sand/40 bg-white shadow-md">
            <img
              src="https://images.pexels.com/photos/9219004/pexels-photo-9219004.jpeg"
              alt="Skincare model displaying radiant skin"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Philosophy Block */}
        <div className="bg-skin-sand/35 border border-skin-sand p-8 md:p-12 rounded-3xl text-center space-y-4 max-w-4xl mx-auto">
          <p className="text-lg md:text-2xl font-serif text-skin-charcoal italic font-light">
            "Your skin is a living canvas reflecting your life's story. Treat it with the patience, gentle formulations, and pure nourishment it deserves."
          </p>
          <p className="text-[10px] uppercase tracking-widest font-bold text-skin-terracotta">
            — SkinAura Science & Dermatology Team
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
