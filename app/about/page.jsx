import React from "react";
import Image from "next/image";

const About = () => {
  return (
    <section className="bg-white py-16 px-6 mt-10">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div>
          <h2 className="text-4xl font-bold text-gray-900 leading-tight">
            Glow Naturally, Shine Confidently
          </h2>

          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            At <span className="font-semibold text-gray-800">SkinAura</span>, we
            believe skincare is more than a daily routine — it’s a ritual of
            self-care and confidence. Our mission is simple: to help you embrace
            your natural glow with products that nourish, repair, and protect
            your skin.
          </p>

          <p className="mt-4 text-gray-600 text-lg leading-relaxed">
            Every skin type is unique. That’s why we create high-quality
            skincare solutions crafted specifically for dry, oily, combination,
            and acne-prone skin. Our formulas blend gentle botanicals with
            modern skincare science to deliver long-lasting, visible results.
          </p>

          <h3 className="mt-8 text-2xl font-semibold text-gray-900">
            Our Promise
          </h3>

          <ul className="mt-4 space-y-3 text-gray-700">
            <li>• Clean, safe, and dermatologically tested ingredients</li>
            <li>• Nature-powered and science-backed formulations</li>
            <li>• Cruelty-free, eco-friendly, responsible production</li>
            <li>• Effective yet gentle for daily use</li>
          </ul>

          <p className="mt-6 text-gray-600 text-lg">
            Your skin is unique — and it deserves skincare that understands it.
            At SkinAura, we’re committed to helping you feel confident in the
            skin you’re in.
          </p>
        </div>

        {/* Image (Pexels) */}
        <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-xl">
          <img
            src="https://images.pexels.com/photos/9219004/pexels-photo-9219004.jpeg"
            alt="Skincare model"
            className="object-cover h-[500px]"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
