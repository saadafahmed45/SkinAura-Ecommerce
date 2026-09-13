import React from "react";
import ProductDetailsClient from "./ProductDetailsClient";
import {
  getProductByIdOrSlug,
  getRelatedProducts,
} from "../../lib/api/products";

export const revalidate = 300; // Cache product detail pages for 5 minutes

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = await getProductByIdOrSlug(resolvedParams.id);

  if (!product) {
    return {
      title: "Product Not Found | SkinAura",
      description: "The requested skincare formulation was not found.",
    };
  }

  const title = `${product.name} | SkinAura`;
  const description =
    product.shortDescription ||
    product.description?.slice(0, 160) ||
    "Dermatologist-formulated luxury botanical skincare by SkinAura.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductDetailsPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Server-side fetch product
  const product = await getProductByIdOrSlug(id);

  // Server-side fetch related products in parallel
  const relatedProducts = product?.category
    ? await getRelatedProducts(product.category, product.id, 4)
    : [];

  return (
    <ProductDetailsClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
