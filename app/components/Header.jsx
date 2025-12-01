"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiShoppingCart } from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { cartItems } = useCart();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Product", href: "/product" },
    { name: "Contact", href: "/contact" },
    { name: "About", href: "/about" },
    { name: "Login", href: "/login" },
  ];

  const menuVariants = {
    hidden: { opacity: 0, x: "-100%" },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "-100%" },
  };

  const getLinkClass = (href) =>
    `transition-colors ${
      pathname === href
        ? "text-blue-500 font-semibold"
        : "text-gray-700 hover:text-blue-500"
    }`;

  return (
    <nav className="bg-white shadow relative">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          {/* <img
            className="w-auto h-7"
            src="https://merakiui.com/images/full-logo.svg"
            alt="Logo"
          /> */}
          <h2 className="text-2xl font-extralight">SkinAura</h2>
        </Link>

        {/* Hamburger button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-600 focus:outline-none lg:hidden"
          aria-label="Toggle Menu"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Desktop menu */}
        <div className="hidden lg:flex lg:items-center lg:space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={getLinkClass(link.href)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/cart"
            className={`relative ${
              pathname === "/cart"
                ? "text-blue-500 font-semibold"
                : "text-gray-700 hover:text-gray-600"
            }`}
          >
            <FiShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-1 rounded-full">
              {cartItems.length}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden absolute inset-x-0 z-20 w-full bg-white px-6 py-4 shadow"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={getLinkClass(link.href)}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/cart"
                className={`relative w-5 ${
                  pathname === "/cart"
                    ? "text-blue-500 font-semibold"
                    : "text-gray-700 hover:text-gray-600"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <FiShoppingCart size={20} />
                <span className="absolute -top-2 left-3 bg-blue-500 text-white text-xs px-1 rounded-full">
                  {cartItems.length}
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;
