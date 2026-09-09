"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingBag,
  FiHeart,
  FiCheck,
  FiTruck,
  FiShield,
  FiChevronRight,
  FiChevronDown,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiDroplet,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { FaStar } from "react-icons/fa";
import ProductCard from "@/app/components/ProductCard";
import { useCart } from "@/app/context/CartContext";
import api from "@/app/lib/api";

const ProductDetails = ({ params }) => {
  const { id } = React.use(params);
  const router = useRouter();
  const { handleAddedCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description"); // "description" | "ingredients" | "howToUse"
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        const p = res.data?.product || res.data?.data;
        if (!p) {
          setNotFound(true);
          return;
        }

        // Normalize product id
        const normalized = {
          ...p,
          id: p._id || p.id,
        };

        setProduct(normalized);
        setSelectedImage(normalized.images?.[0] || "");

        // Fetch related products from the same category
        if (normalized.category) {
          const relRes = await api.get(
            `/products?category=${encodeURIComponent(normalized.category)}&limit=5`
          );
          const all = relRes.data?.products || relRes.data?.data || [];
          setRelatedProducts(
            all.filter((rp) => (rp._id || rp.id) !== normalized.id).slice(0, 4)
          );
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const handleAddToCart = (e) => {
    e?.preventDefault();
    if (!product) return;

    // Add normalized product with selected quantity
    handleAddedCart({
      ...product,
      quantity,
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const handleInstantBuy = (e) => {
    e?.preventDefault();
    if (!product) return;

    handleAddedCart({
      ...product,
      quantity,
    });
    router.push("/cart");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-4 w-48 bg-skin-sand/60 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 aspect-square bg-skin-sand/40 rounded-3xl" />
            <div className="lg:col-span-5 space-y-6 pt-4">
              <div className="h-4 w-24 bg-skin-sand/60 rounded" />
              <div className="h-10 w-3/4 bg-skin-sand/60 rounded" />
              <div className="h-6 w-36 bg-skin-sand/60 rounded" />
              <div className="h-24 w-full bg-skin-sand/40 rounded-2xl" />
              <div className="h-12 w-full bg-skin-sand/60 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-skin-terracotta/10 text-skin-terracotta flex items-center justify-center mb-4">
          <HiSparkles size={22} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-skin-charcoal font-medium mb-2">
          Product Not Found
        </h2>
        <p className="text-xs sm:text-sm text-skin-charcoal/60 max-w-sm mb-6 font-light">
          The skincare solution you are seeking may have been archived or is temporarily unavailable.
        </p>
        <Link
          href="/product"
          className="inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-widest font-semibold bg-skin-charcoal text-white rounded-xl hover:bg-skin-terracotta transition-colors shadow-sm"
        >
          <FiArrowLeft size={14} />
          <span>Return to Collection</span>
        </Link>
      </div>
    );
  }

  const finalPrice =
    product.discount > 0 && product.discountPrice
      ? Number(product.discountPrice)
      : Number(product.price || 0);

  const originalPrice = Number(product.price || 0);
  const savings = product.discount > 0 ? originalPrice - finalPrice : 0;

  return (
    <div className="bg-[#FCFAF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        {/* ── BREADCRUMB ── */}
        <nav aria-label="Breadcrumb" className="mb-8 text-xs font-sans text-skin-charcoal/50">
          <ol className="flex items-center flex-wrap gap-2">
            <li>
              <Link href="/" className="hover:text-skin-charcoal transition-colors">
                Home
              </Link>
            </li>
            <li>
              <FiChevronRight size={12} className="text-skin-charcoal/30" />
            </li>
            <li>
              <Link href="/product" className="hover:text-skin-charcoal transition-colors">
                Shop
              </Link>
            </li>
            {product.category && (
              <>
                <li>
                  <FiChevronRight size={12} className="text-skin-charcoal/30" />
                </li>
                <li>
                  <Link
                    href={`/product?category=${encodeURIComponent(product.category)}`}
                    className="hover:text-skin-charcoal transition-colors"
                  >
                    {product.category}
                  </Link>
                </li>
              </>
            )}
            <li>
              <FiChevronRight size={12} className="text-skin-charcoal/30" />
            </li>
            <li className="text-skin-charcoal font-medium truncate max-w-[220px]">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* ── MAIN PRODUCT SECTION ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start mb-24">
          {/* ── LEFT: IMAGE GALLERY (7 COLS) ── */}
          <div className="lg:col-span-7 flex flex-col gap-4 lg:sticky lg:top-36">
            {/* Hero Main Image Showcase */}
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#FBF9F5] via-white to-[#F5EFE6]/50 border border-skin-sand/60 shadow-xs flex items-center justify-center p-6 sm:p-12 group">
              {/* Discount Tag */}
              {product.discount > 0 && (
                <div className="absolute top-5 left-5 z-10">
                  <span className="bg-skin-terracotta text-white text-[10px] tracking-[0.16em] uppercase font-bold px-3 py-1.5 rounded-full shadow-xs">
                    SAVE {product.discount}%
                  </span>
                </div>
              )}

              {/* Wishlist Toggle Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label="Add to wishlist"
                className={`absolute top-5 right-5 z-10 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  isWishlisted
                    ? "bg-skin-terracotta text-white border-skin-terracotta shadow-sm scale-105"
                    : "bg-white/80 backdrop-blur-sm text-skin-charcoal/60 border-skin-sand hover:text-skin-terracotta hover:border-skin-terracotta/40"
                }`}
              >
                <FiHeart size={16} className={isWishlisted ? "fill-white" : ""} />
              </button>

              <img
                src={
                  selectedImage ||
                  "https://images.pexels.com/photos/3762756/pexels-photo-3762756.jpeg"
                }
                alt={product.name}
                className="w-full h-full object-contain max-h-[460px] transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>

            {/* Thumbnail Gallery Row */}
            {product.images?.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-1 scrollbar-none">
                {product.images.map((img, i) => {
                  const isSelected = selectedImage === img;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      aria-label={`View thumbnail ${i + 1}`}
                      className={`relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden border p-2 bg-white transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "ring-2 ring-skin-terracotta border-skin-terracotta shadow-xs"
                          : "border-skin-sand/70 hover:border-skin-terracotta/50 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${i + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Natural Ingredients / Formulation Trust Strip */}
            <div className="hidden sm:grid grid-cols-3 gap-3 pt-4 border-t border-skin-sand/40 text-center">
              <div className="p-3 bg-white/70 rounded-2xl border border-skin-sand/40">
                <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-skin-charcoal/40 block mb-1">
                  Purity Standard
                </span>
                <span className="text-xs font-serif font-semibold text-skin-charcoal">
                  100% Clean Actives
                </span>
              </div>
              <div className="p-3 bg-white/70 rounded-2xl border border-skin-sand/40">
                <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-skin-charcoal/40 block mb-1">
                  Safety Verified
                </span>
                <span className="text-xs font-serif font-semibold text-skin-charcoal">
                  Dermatologist Tested
                </span>
              </div>
              <div className="p-3 bg-white/70 rounded-2xl border border-skin-sand/40">
                <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-skin-charcoal/40 block mb-1">
                  Cruelty Free
                </span>
                <span className="text-xs font-serif font-semibold text-skin-charcoal">
                  Ethically Sourced
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: PRODUCT DETAILS & ACTIONS (5 COLS) ── */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Header / Brand / Category */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10.5px] uppercase tracking-[0.2em] font-semibold text-skin-terracotta">
                  {product.brand || "Skin-Aura"}
                </span>
                {product.category && (
                  <>
                    <span className="text-skin-sand/80">•</span>
                    <span className="text-[10.5px] uppercase tracking-[0.18em] font-medium text-skin-charcoal/50">
                      {product.category}
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-skin-charcoal font-medium leading-[1.2] tracking-tight">
                {product.name}
              </h1>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={13} className="fill-current mr-0.5" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-skin-charcoal">
                  {product.rating || "4.9"}
                </span>
                <span className="text-xs text-skin-charcoal/40">
                  ({product.reviewCount || 48} reviews)
                </span>
              </div>
            </div>

            {/* Price Row */}
            <div className="p-4 rounded-2xl bg-white border border-skin-sand/60 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-skin-charcoal">
                  Rs. {finalPrice.toFixed(2)}
                </span>
                {product.discount > 0 && (
                  <span className="text-sm sm:text-base text-skin-charcoal/40 line-through font-light">
                    Rs. {originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {savings > 0 && (
                <p className="text-[11px] font-medium text-skin-terracotta">
                  You save Rs. {savings.toFixed(2)} ({product.discount}% off)
                </p>
              )}

              {/* Stock status indicator */}
              <div className="pt-2 border-t border-skin-sand/30 flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    product.inStock ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                  }`}
                />
                <span className="text-xs text-skin-charcoal/70 font-medium">
                  {product.inStock
                    ? `In Stock · Ships within 24h (${product.stock || "Ready to dispatch"})`
                    : "Temporarily Out of Stock"}
                </span>
              </div>
            </div>

            {/* Short Description */}
            {product.description && (
              <p className="text-xs sm:text-sm text-skin-charcoal/75 leading-relaxed font-light font-sans">
                {product.description}
              </p>
            )}

            {/* Quantity Selector & Purchase Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase font-semibold text-skin-charcoal/60 tracking-wider">
                  Quantity
                </span>
                <div className="flex items-center border border-skin-sand bg-white rounded-xl px-2 py-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || !product.inStock}
                    aria-label="Decrease quantity"
                    className="w-7 h-7 flex items-center justify-center text-skin-charcoal/60 hover:text-skin-charcoal disabled:opacity-30 cursor-pointer"
                  >
                    <FiMinus size={13} />
                  </button>
                  <span className="w-9 text-center text-xs font-semibold font-mono text-skin-charcoal">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock || 10, q + 1))
                    }
                    disabled={!product.inStock || quantity >= (product.stock || 10)}
                    aria-label="Increase quantity"
                    className="w-7 h-7 flex items-center justify-center text-skin-charcoal/60 hover:text-skin-charcoal disabled:opacity-30 cursor-pointer"
                  >
                    <FiPlus size={13} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-3.5 px-6 rounded-xl text-xs uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-sm ${
                    product.inStock
                      ? "bg-skin-charcoal text-white hover:bg-skin-terracotta active:scale-[0.98]"
                      : "bg-skin-sand text-skin-charcoal/40 cursor-not-allowed"
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <FiCheck size={16} className="text-emerald-400" />
                      <span>Added to Ritual</span>
                    </>
                  ) : (
                    <>
                      <FiShoppingBag size={15} />
                      <span>Add to Ritual</span>
                    </>
                  )}
                </button>

                {/* Instant Order / Buy Now */}
                <button
                  onClick={handleInstantBuy}
                  disabled={!product.inStock}
                  className={`py-3.5 px-6 rounded-xl text-xs uppercase tracking-[0.18em] font-semibold border transition-all duration-300 cursor-pointer ${
                    product.inStock
                      ? "border-skin-charcoal text-skin-charcoal hover:bg-skin-sand/60 active:scale-[0.98]"
                      : "border-skin-sand text-skin-charcoal/30 cursor-not-allowed"
                  }`}
                >
                  Instant Checkout
                </button>
              </div>
            </div>

            {/* Delivery & Assurance Guarantees */}
            <div className="p-4 rounded-2xl bg-skin-cream/60 border border-skin-sand/60 space-y-2.5 text-xs text-skin-charcoal/70">
              <div className="flex items-center gap-2.5">
                <FiTruck size={15} className="text-skin-terracotta shrink-0" />
                <span>
                  Complimentary tracked delivery on orders over{" "}
                  <strong className="text-skin-charcoal font-semibold">Rs. 2,500</strong>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiShield size={15} className="text-skin-sage shrink-0" />
                <span>Dermatologist recommended & hypoallergenic guarantee</span>
              </div>
            </div>

            {/* ── TABS / ACCORDIONS FOR INGREDIENTS & RITUAL DETAILS ── */}
            <div className="pt-2 border-t border-skin-sand/40 space-y-2">
              {/* Tab navigation buttons */}
              <div className="flex border-b border-skin-sand/50 gap-6">
                {[
                  { id: "description", label: "The Ritual" },
                  { id: "ingredients", label: "Key Actives" },
                  { id: "skinType", label: "Skin Compatibility" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2.5 text-xs tracking-wider uppercase font-semibold transition-all relative cursor-pointer ${
                      activeTab === tab.id
                        ? "text-skin-terracotta"
                        : "text-skin-charcoal/50 hover:text-skin-charcoal"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-skin-terracotta"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content Display */}
              <div className="pt-3 min-h-[90px]">
                {activeTab === "description" && (
                  <div className="text-xs text-skin-charcoal/75 leading-relaxed font-light space-y-2">
                    <p>
                      {product.shortDescription ||
                        product.description ||
                        "Formulated to replenish vital moisture barriers while defending against daily environmental stressors."}
                    </p>
                    <p className="font-serif italic text-skin-charcoal/60">
                      Apply 2-3 drops morning and evening to cleansed skin. Press gently into face and neck before applying moisturizer.
                    </p>
                  </div>
                )}

                {activeTab === "ingredients" && (
                  <div className="space-y-2.5">
                    {product.ingredients?.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {product.ingredients.map((ing, i) => (
                          <span
                            key={i}
                            className="bg-white border border-skin-sand/80 text-skin-charcoal px-3 py-1 rounded-full text-[11px] font-medium"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-skin-charcoal/60 font-light">
                        Full clinical botanical active list: Centella Asiatica, Niacinamide, Hyaluronic Acid, Squalane, Ceramides.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "skinType" && (
                  <div className="space-y-2">
                    {product.skinType?.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {product.skinType.map((st, i) => (
                          <span
                            key={i}
                            className="bg-skin-terracotta/10 text-skin-terracotta font-medium px-3 py-1 rounded-full text-[11px]"
                          >
                            {st}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-skin-charcoal/60 font-light">
                        Suitable for all skin types, including sensitive and barrier-compromised skin.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── RELATED PRODUCTS / COMPLETE YOUR RITUAL ── */}
        {relatedProducts.length > 0 && (
          <section className="pt-16 border-t border-skin-sand/50">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
              <div>
                <span className="text-[10.5px] uppercase tracking-[0.2em] font-semibold text-skin-terracotta block mb-1">
                  Layer & Enhance
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-skin-charcoal font-medium">
                  Complete Your Daily Ritual
                </h2>
              </div>
              <Link
                href={`/product?category=${encodeURIComponent(product.category || "all")}`}
                className="text-xs uppercase tracking-widest font-semibold text-skin-charcoal/70 hover:text-skin-terracotta transition-colors flex items-center gap-1"
              >
                <span>View More in {product.category}</span>
                <FiChevronRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard product={rp} key={rp._id || rp.id} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
