import React from "react";

const CtaSection = () => {
  return (
    <section className="bg-skin-sand py-20 px-6 border-t border-skin-sand/40">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <span className="text-xs uppercase tracking-widest text-skin-terracotta font-bold">
          Join the community
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-skin-charcoal leading-tight">
          Unlock 10% Off Your First Ritual
        </h2>
        <p className="text-sm text-skin-charcoal/80 max-w-lg mx-auto font-light leading-relaxed">
          Subscribe to the SkinAura Journal to receive expert skincare advice, product launches, and exclusive member-only offers.
        </p>

        <form className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-4">
          <input
            type="email"
            required
            placeholder="Enter your email address"
            className="w-full sm:w-2/3 p-3 text-sm bg-white border border-skin-sand rounded-xl focus:border-skin-sage focus:outline-none focus:ring-1 focus:ring-skin-sage text-skin-charcoal placeholder-skin-charcoal/50"
          />
          <button
            type="submit"
            className="w-full sm:w-1/3 p-3 text-xs uppercase tracking-widest font-semibold bg-skin-charcoal text-white rounded-xl hover:bg-skin-sage transition-all duration-300 shadow-md"
          >
            Subscribe
          </button>
        </form>
        <p className="text-[10px] text-skin-charcoal/50">
          By signing up, you consent to our privacy policy and can unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

export default CtaSection;
