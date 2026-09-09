"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function MainLayoutShell({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <main className="min-h-screen bg-skin-cream/10">{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div className="h-20 bg-white" />}>
        <Header />
      </Suspense>
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
