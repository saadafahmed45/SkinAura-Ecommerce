import React from "react";
import Link from "next/link";
import { FaInstagram, FaFacebookF, FaPinterestP, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-skin-cream border-t border-skin-sand/60">
      <div className="container px-6 md:px-12 py-16 mx-auto">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          
          {/* Brand Info */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-6">
            <Link href="/">
              <h2 className="text-3xl font-serif tracking-widest text-skin-charcoal">
                SKINAURA
              </h2>
            </Link>
            <p className="text-sm text-skin-charcoal/80 leading-relaxed max-w-sm">
              Science-backed, dermatologist-inspired skincare designed to nourish, balance, and reveal your skin's natural glow. Elevate your daily ritual.
            </p>
            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-xs tracking-wider uppercase font-semibold text-skin-charcoal">
                Subscribe to our journal
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                <input
                  id="footer-email"
                  type="email"
                  className="px-4 py-2.5 text-sm bg-white border border-skin-sand rounded-xl focus:border-skin-sage focus:outline-none focus:ring-1 focus:ring-skin-sage flex-grow text-skin-charcoal"
                  placeholder="Your email address"
                />
                <button className="px-6 py-2.5 text-xs font-semibold tracking-widest uppercase text-white bg-skin-charcoal rounded-xl hover:bg-skin-sage transition-all duration-300">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Shop Categories */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-bold text-skin-charcoal">
              Collections
            </h4>
            <div className="flex flex-col space-y-2 text-sm text-skin-charcoal/80">
              <Link href="/category/Facewash" className="hover:text-skin-terracotta transition-colors duration-200">
                Cleansers
              </Link>
              <Link href="/category/Cream" className="hover:text-skin-terracotta transition-colors duration-200">
                Moisturizers
              </Link>
              <Link href="/category/Serum" className="hover:text-skin-terracotta transition-colors duration-200">
                Active Serums
              </Link>
              <Link href="/category/Sunscreen" className="hover:text-skin-terracotta transition-colors duration-200">
                Sun Protection
              </Link>
            </div>
          </div>

          {/* Customer Care */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-bold text-skin-charcoal">
              Assistance
            </h4>
            <div className="flex flex-col space-y-2 text-sm text-skin-charcoal/80">
              <Link href="/contact" className="hover:text-skin-terracotta transition-colors duration-200">
                Contact Us
              </Link>
              <Link href="/about" className="hover:text-skin-terracotta transition-colors duration-200">
                Our Philosophy
              </Link>
              <Link href="/product" className="hover:text-skin-terracotta transition-colors duration-200">
                Product Catalog
              </Link>
              <a href="#" className="hover:text-skin-terracotta transition-colors duration-200">
                Shipping & Returns
              </a>
            </div>
          </div>

          {/* Legal / Socials */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-bold text-skin-charcoal">
              Stay Connected
            </h4>
            <div className="flex flex-col space-y-2 text-sm text-skin-charcoal/80">
              <a href="#" className="hover:text-skin-terracotta transition-colors duration-200">
                Instagram
              </a>
              <a href="#" className="hover:text-skin-terracotta transition-colors duration-200">
                Pinterest
              </a>
              <a href="#" className="hover:text-skin-terracotta transition-colors duration-200">
                Facebook
              </a>
              <a href="#" className="hover:text-skin-terracotta transition-colors duration-200">
                YouTube
              </a>
            </div>
          </div>

        </div>

        <hr className="my-10 border-skin-sand/55" />

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-skin-charcoal/60">
            &copy; {new Date().getFullYear()} SkinAura. All rights reserved. Crafted with care.
          </p>

          <div className="flex space-x-4">
            <a href="#" className="text-skin-charcoal/60 hover:text-skin-terracotta transition-colors" aria-label="Facebook">
              <FaFacebookF size={16} />
            </a>
            <a href="#" className="text-skin-charcoal/60 hover:text-skin-terracotta transition-colors" aria-label="Instagram">
              <FaInstagram size={16} />
            </a>
            <a href="#" className="text-skin-charcoal/60 hover:text-skin-terracotta transition-colors" aria-label="Pinterest">
              <FaPinterestP size={16} />
            </a>
            <a href="#" className="text-skin-charcoal/60 hover:text-skin-terracotta transition-colors" aria-label="Twitter">
              <FaTwitter size={16} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
