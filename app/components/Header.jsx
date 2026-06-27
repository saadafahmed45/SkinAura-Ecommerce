"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiShoppingCart } from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { cartItems } = useCart();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Product", href: "/product" },
    { name: "Contact", href: "/contact" },
    { name: "About", href: "/about" },
    { name: "Login", href: "/login" },
  ];

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) setIsScrolled(true);
      else setIsScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Nav background + text color logic
  const isHomeTransparent = pathname === "/" && !isScrolled;

  const navbarBG = isHomeTransparent 
    ? "bg-transparent border-transparent" 
    : "bg-skin-cream/85 backdrop-blur-md border-b border-skin-sand/40 shadow-sm";

  const textColor = isHomeTransparent ? "text-white" : "text-skin-charcoal";

  const iconColor = isHomeTransparent ? "white" : "#2A2925";

  const getLinkClass = (href) => {
    const baseClass = "transition-all duration-300 relative py-1 text-xs tracking-widest uppercase font-medium";
    if (pathname === href) {
      return `${baseClass} text-skin-terracotta font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-skin-terracotta`;
    }
    return isHomeTransparent
      ? `${baseClass} text-white hover:text-skin-sand after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all after:duration-300`
      : `${baseClass} text-skin-charcoal hover:text-skin-sage after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-skin-sage hover:after:w-full after:transition-all after:duration-300`;
  };

  return (
    <nav
      className={`${navbarBG} fixed top-0 left-0 w-full z-30 transition-all duration-500`}
    >
      <div className="container mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <h2
            className={`text-2xl tracking-widest font-serif transition-colors duration-300 ${textColor}`}
          >
            SKINAURA
          </h2>
        </Link>

        {/* Mobile Left Side — Cart Icon + Hamburger */}
        <div className="lg:hidden flex items-center gap-4">
          <Link href="/cart" className="relative p-1">
            <FiShoppingCart size={22} color={iconColor} />
            <span className="absolute -top-1 -right-1 bg-skin-terracotta text-white text-[10px] w-4 h-4 flex items-center justify-center font-bold rounded-full">
              {cartItems.length}
            </span>
          </Link>

          <button onClick={() => setIsOpen(!isOpen)} className="p-1">
            {isOpen ? (
              <FiX size={24} color={iconColor} />
            ) : (
              <FiMenu size={24} color={iconColor} />
            )}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:items-center lg:space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={getLinkClass(link.href)}
            >
              {link.name}
            </Link>
          ))}

          <Link href="/cart" className="relative p-1 hover:scale-105 transition-transform duration-200">
            <FiShoppingCart size={20} color={iconColor} />
            <span className="absolute -top-1 -right-1 bg-skin-terracotta text-white text-[10px] w-4 h-4 flex items-center justify-center font-bold rounded-full">
              {cartItems.length}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute inset-x-0 top-[100%] z-20 bg-skin-cream/95 backdrop-blur-lg px-6 py-6 border-b border-skin-sand/50 shadow-md"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm uppercase tracking-wider font-medium py-2 border-b border-skin-sand/20 ${
                    pathname === link.href ? "text-skin-terracotta" : "text-skin-charcoal hover:text-skin-sage"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;
