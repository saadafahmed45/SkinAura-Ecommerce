import React, { Suspense } from "react";
import ProductsContentClient from "./ProductsContentClient";
import { getCategories } from "../lib/api/categories";
import { getProducts } from "../lib/api/products";

export const revalidate = 300; // Cache shop catalog for 5 minutes

export const metadata = {
  title: "Shop All Skincare Formulations | SkinAura",
  description:
    "Explore our complete collection of dermatologist-inspired botanical skincare: serums, cleansers, creams, and moisturizers.",
};

export default async function ProductsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;

  const [categories, initialData] = await Promise.all([
    getCategories(),
    getProducts({
      category: resolvedSearchParams?.category || "",
      sort: resolvedSearchParams?.sort || "",
      search: resolvedSearchParams?.search || "",
      page: resolvedSearchParams?.page || 1,
      limit: 8,
    }),
  ]);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-skin-cream/30 gap-4">
          <div className="w-10 h-10 border-2 border-skin-terracotta border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-skin-charcoal/50 font-bold">
            Loading Catalog...
          </p>
        </div>
      }
    >
      <ProductsContentClient
        initialCategories={categories}
        initialProductsData={initialData}
      />
    </Suspense>
  );
}
