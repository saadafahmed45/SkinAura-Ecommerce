"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiShoppingCart, FiSearch, FiUser } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const { cartItems } = useCart();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/product" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isHomeTransparent = pathname === "/" && !isScrolled;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isHomeTransparent
            ? "bg-transparent border-transparent"
            : "bg-white/80 backdrop-blur-xl border-b border-skin-sand/40 shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-0 flex items-center justify-between h-[70px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                isHomeTransparent
                  ? "bg-white/20 backdrop-blur-sm"
                  : "bg-skin-terracotta/10"
              }`}
            >
              <HiSparkles
                size={16}
                className={`transition-colors duration-300 ${
                  isHomeTransparent ? "text-white" : "text-skin-terracotta"
                }`}
              />
            </div>
            <span
              className={`text-xl tracking-[0.2em] font-serif font-semibold transition-colors duration-300 ${
                isHomeTransparent ? "text-white" : "text-skin-charcoal"
              }`}
            >
              SKIN-AURA
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-[11px] tracking-[0.18em] uppercase font-semibold transition-all duration-300 py-1 group ${
                    isActive
                      ? isHomeTransparent
                        ? "text-skin-sand"
                        : "text-skin-terracotta"
                      : isHomeTransparent
                        ? "text-white/80 hover:text-white"
                        : "text-skin-charcoal/70 hover:text-skin-charcoal"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-[1.5px] rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-full bg-skin-terracotta"
                        : isHomeTransparent
                          ? "w-0 group-hover:w-full bg-white"
                          : "w-0 group-hover:w-full bg-skin-terracotta"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Icons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isHomeTransparent
                  ? "bg-white/15 hover:bg-white/25 text-white"
                  : "bg-skin-sand/60 hover:bg-skin-sand text-skin-charcoal"
              }`}
            >
              <FiSearch size={16} />
            </button>

            {/* Login */}
            <Link
              href="/login"
              className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 ${
                isHomeTransparent
                  ? "bg-white/15 hover:bg-white/25 text-white"
                  : "bg-skin-sand/60 hover:bg-skin-sand text-skin-charcoal"
              }`}
            >
              <FiUser size={16} />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 ${
                isHomeTransparent
                  ? "bg-white/15 hover:bg-white/25 text-white"
                  : "bg-skin-sand/60 hover:bg-skin-sand text-skin-charcoal"
              }`}
            >
              <FiShoppingCart size={16} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-skin-terracotta text-white text-[9px] w-4 h-4 flex items-center justify-center font-bold rounded-full shadow">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Right */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/login"
              className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isHomeTransparent
                  ? "bg-white/15 text-white"
                  : "bg-skin-sand/60 text-skin-charcoal"
              }`}
            >
              <FiUser size={16} />
            </Link>
            <Link
              href="/cart"
              className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isHomeTransparent
                  ? "bg-white/15 text-white"
                  : "bg-skin-sand/60 text-skin-charcoal"
              }`}
            >
              <FiShoppingCart size={16} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-skin-terracotta text-white text-[9px] w-4 h-4 flex items-center justify-center font-bold rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isHomeTransparent
                  ? "bg-white/15 text-white"
                  : "bg-skin-sand/60 text-skin-charcoal"
              }`}
            >
              {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-skin-sand/30 bg-white/95 backdrop-blur-xl"
            >
              <div className="max-w-7xl mx-auto px-5 md:px-10 py-4">
                <div className="flex items-center gap-3 bg-skin-cream rounded-xl px-4 py-3 border border-skin-sand/60">
                  <FiSearch size={16} className="text-skin-charcoal/50" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search products, brands..."
                    className="flex-1 bg-transparent text-sm text-skin-charcoal placeholder-skin-charcoal/40 outline-none"
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="text-skin-charcoal/50 hover:text-skin-charcoal transition-colors"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-[75%] max-w-xs bg-white z-50 lg:hidden flex flex-col shadow-2xl"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-skin-sand/40">
                <span className="text-lg font-serif text-skin-charcoal tracking-widest">
                  SKINAURA
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-skin-sand/60"
                >
                  <FiX size={16} className="text-skin-charcoal" />
                </button>
              </div>

              {/* Mobile Links */}
              <div className="flex flex-col px-6 py-6 gap-2 flex-1">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between py-3.5 px-4 rounded-xl text-sm tracking-wider font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-skin-terracotta/10 text-skin-terracotta font-semibold"
                            : "text-skin-charcoal hover:bg-skin-sand/60"
                        }`}
                      >
                        {link.name}
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-skin-terracotta" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile Footer */}
              <div className="px-6 pb-8">
                <Link href="/product" onClick={() => setIsOpen(false)}>
                  <button className="w-full py-3.5 rounded-xl bg-skin-charcoal text-white text-xs tracking-widest uppercase font-bold shadow-md">
                    Shop Now
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
