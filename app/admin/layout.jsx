"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  FiGrid,
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiLayers,
  FiExternalLink,
  FiLogOut,
  FiMenu,
  FiX,
  FiShield,
} from "react-icons/fi";

const AdminLayout = ({ children }) => {
  const { user, loading, isAdmin, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Authentication check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-skin-cream/20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-skin-terracotta border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs uppercase tracking-widest text-skin-charcoal/60 font-semibold">
            Verifying Admin Credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-skin-cream/20 px-6 py-20">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-skin-sand/40 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
            <FiShield size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-serif text-skin-charcoal">Access Restricted</h2>
            <p className="text-xs text-skin-charcoal/60 mt-2">
              You must be logged in as an administrator to view the SkinAura control center.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/login?redirect=/admin"
              className="w-full py-3 bg-skin-charcoal hover:bg-skin-terracotta text-white rounded-xl text-xs uppercase tracking-wider font-bold transition duration-300"
            >
              Sign In as Admin
            </Link>
            <Link
              href="/"
              className="w-full py-3 border border-skin-sand text-skin-charcoal rounded-xl text-xs uppercase tracking-wider font-bold hover:bg-skin-sand/20 transition duration-300"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: "Overview", href: "/admin", icon: FiGrid },
    { label: "Products", href: "/admin/products", icon: FiBox },
    { label: "Categories", href: "/admin/categories", icon: FiLayers },
    { label: "Orders", href: "/admin/orders", icon: FiShoppingBag },
    { label: "Customers", href: "/admin/customers", icon: FiUsers },
  ];

  return (
    <div className="min-h-screen bg-skin-cream/10 flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-skin-sand/40 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="text-lg font-serif font-bold tracking-widest text-skin-charcoal">
            SKINAURA
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-skin-terracotta/15 text-skin-terracotta rounded-md">
            Admin
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-skin-charcoal hover:bg-skin-sand/20 rounded-xl"
        >
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Sidebar for Desktop / Drawer for Mobile */}
      <aside
        className={`${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:sticky top-0 left-0 z-50 md:z-30 h-screen w-64 bg-white border-r border-skin-sand/40 flex flex-col justify-between transition-transform duration-300 ease-in-out`}
      >
        <div>
          {/* Logo & Admin Badge */}
          <div className="p-6 border-b border-skin-sand/30">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-xl font-serif font-bold tracking-widest text-skin-charcoal">
                SKINAURA
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-skin-terracotta/15 text-skin-terracotta rounded-md">
                Admin
              </span>
            </Link>
            <p className="text-[10px] text-skin-charcoal/50 uppercase tracking-wider mt-1">
              Management Portal
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs uppercase tracking-wider font-semibold transition-all duration-200 ${
                    active
                      ? "bg-skin-charcoal text-white shadow-md shadow-skin-charcoal/10"
                      : "text-skin-charcoal/70 hover:bg-skin-cream/40 hover:text-skin-charcoal"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-skin-sand/30 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-skin-charcoal/70 hover:bg-skin-sand/20 hover:text-skin-charcoal transition"
          >
            <span className="flex items-center gap-2">
              <FiExternalLink size={14} />
              View Storefront
            </span>
          </Link>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 transition text-left"
          >
            <FiLogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
