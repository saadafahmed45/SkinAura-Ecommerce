"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CategoryDynamicRedirect = ({ params }) => {
  const router = useRouter();
  const unwrappedParams =
    params && typeof params.then === "function" ? React.use(params) : params;
  const rawId = unwrappedParams?.id || "";
  const categoryName = decodeURIComponent(rawId);

  useEffect(() => {
    if (categoryName) {
      router.replace(`/product?category=${encodeURIComponent(categoryName)}`);
    } else {
      router.replace("/product");
    }
  }, [categoryName, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-skin-cream/20 gap-4 px-6 text-center">
      <div className="w-10 h-10 border-2 border-skin-terracotta border-t-transparent rounded-full animate-spin" />
      <p className="text-xs uppercase tracking-widest text-skin-charcoal/60">
        Navigating to {categoryName || "Products"} catalog...
      </p>
      <Link
        href={categoryName ? `/product?category=${encodeURIComponent(categoryName)}` : "/product"}
        className="text-xs text-skin-terracotta underline hover:text-skin-charcoal transition-colors mt-2"
      >
        Click here if not redirected automatically
      </Link>
    </div>
  );
};

export default CategoryDynamicRedirect;

