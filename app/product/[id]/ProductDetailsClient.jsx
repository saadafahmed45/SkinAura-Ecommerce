"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingBag,
  FiHeart,
  FiCheck,
  FiTruck,
  FiShield,
  FiChevronRight,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiShare2,
  FiRefreshCw,
  FiAward,
  FiCopy,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { FaStar, FaRegStar } from "react-icons/fa";
import ProductCard from "@/app/components/ProductCard";
import { useCart } from "@/app/context/CartContext";

export default function ProductDetailsClient({ product, relatedProducts = [] }) {
  const router = useRouter();
  const { handleAddedCart } = useCart();

  const defaultFallback =
    "https://images.pexels.com/photos/3762756/pexels-photo-3762756.jpeg";

  const getSafeImage = (url) => {
    if (!url || typeof url !== "string") return defaultFallback;
    if (url.includes("laroche-posay.us")) return defaultFallback;
    if (url.includes("bioderma.co.uk"))
      return "https://images.pexels.com/photos/3736398/pexels-photo-3736398.jpeg";
    return url;
  };

  const [selectedImage, setSelectedImage] = useState(
    getSafeImage(product?.images?.[0] || defaultFallback)
  );
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description"); // "description" | "benefits" | "ingredients" | "skinType" | "shipping"
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const fallbackBenefits = [
    "Deeply hydrates and reinforces skin's natural moisture barrier",
    "Soothes redness and protects against environmental stress",
    "Improves elasticity for a firmer, radiant complexion",
    "Clean, hypoallergenic formula safe for daily AM & PM use",
  ];

  const benefitsList =
    Array.isArray(product?.keyBenefits) && product.keyBenefits.length > 0
      ? product.keyBenefits
      : fallbackBenefits;

  // Review submission state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      author: "Tahmina A.",
      rating: 5,
      date: "2 days ago",
      verified: true,
      comment:
        "Absolute game changer for my winter barrier repair routine. Light texture, absorbs immediately, and leaves a dewy finish without any greasiness.",
    },
    {
      id: 2,
      author: "Rafiq H.",
      rating: 5,
      date: "1 week ago",
      verified: true,
      comment:
        "100% genuine formulation. Fast dispatch and excellent eco-luxe packaging. I saw noticeable reduction in redness within 48 hours.",
    },
    {
      id: 3,
      author: "Samira K.",
      rating: 4.8,
      date: "2 weeks ago",
      verified: true,
      comment:
        "Extremely gentle on sensitive skin. Pairs beautifully underneath sunscreen and makeup. Highly recommended!",
    },
  ]);

  // Sync state when product changes (e.g. clicking related products)
  useEffect(() => {
    if (product?.images?.[0]) {
      setSelectedImage(getSafeImage(product.images[0]));
    } else {
      setSelectedImage(defaultFallback);
    }
    setQuantity(1);
    setActiveTab("description");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-[#FCFAF7]">
        <div className="w-14 h-14 rounded-full bg-skin-terracotta/10 text-skin-terracotta flex items-center justify-center mb-4">
          <HiSparkles size={24} />
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

  const handleAddToCart = (e) => {
    e?.preventDefault();
    handleAddedCart(product, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const handleInstantBuy = (e) => {
    e?.preventDefault();
    handleAddedCart(product, quantity, true);
    router.push("/cart");
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    const newRev = {
      id: Date.now(),
      author: reviewerName.trim(),
      rating: newRating,
      date: "Just now",
      verified: true,
      comment: reviewComment.trim(),
    };

    setReviewsList([newRev, ...reviewsList]);
    setReviewerName("");
    setReviewComment("");
    setShowReviewForm(false);
  };

  return (
    <div className="bg-[#FCFAF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        {/* ── BREADCRUMB NAVIGATION ── */}
        <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8 text-xs font-sans text-skin-charcoal/50">
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
                    className="hover:text-skin-charcoal transition-colors capitalize"
                  >
                    {product.category}
                  </Link>
                </li>
              </>
            )}
            <li>
              <FiChevronRight size={12} className="text-skin-charcoal/30" />
            </li>
            <li className="text-skin-charcoal font-medium truncate max-w-[200px] sm:max-w-[320px]">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* ── MAIN PRODUCT SECTION ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start mb-20">
          {/* ── LEFT: IMAGE GALLERY (7 COLS) ── */}
          <div className="lg:col-span-7 flex flex-col gap-4 lg:sticky lg:top-28">
            {/* Main Showcase Canvas */}
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-skin-sand/70 shadow-sm flex items-center justify-center p-6 sm:p-12 group">
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5 pointer-events-none">
                {product.discount > 0 && (
                  <span className="bg-skin-terracotta text-white text-[10px] tracking-[0.16em] uppercase font-bold px-3 py-1 rounded-full shadow-xs">
                    SAVE {product.discount}%
                  </span>
                )}
                {product.isFeatured && (
                  <span className="bg-skin-charcoal text-white text-[9.5px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full shadow-xs">
                    Featured
                  </span>
                )}
              </div>

              {/* Action Icons (Wishlist & Share) */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  aria-label="Copy product link"
                  title="Copy link"
                  className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-skin-sand text-skin-charcoal/60 hover:text-skin-terracotta hover:border-skin-terracotta/40 flex items-center justify-center transition-all shadow-xs cursor-pointer"
                >
                  {linkCopied ? <FiCheck size={14} className="text-emerald-500" /> : <FiShare2 size={14} />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all shadow-xs cursor-pointer ${
                    isWishlisted
                      ? "bg-skin-terracotta text-white border-skin-terracotta shadow-sm scale-105"
                      : "bg-white/90 backdrop-blur-sm text-skin-charcoal/60 border-skin-sand hover:text-skin-terracotta hover:border-skin-terracotta/40"
                  }`}
                >
                  <FiHeart size={15} className={isWishlisted ? "fill-white" : ""} />
                </button>
              </div>

              {/* Product Visual */}
              <div className="relative w-full h-full max-h-[460px]">
                <Image
                  src={selectedImage}
                  alt={product.name || "Product"}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                  onError={() => setSelectedImage(defaultFallback)}
                />
              </div>
            </div>

            {/* Thumbnail Gallery Row */}
            {product.images?.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-1 scrollbar-none">
                {product.images.map((rawImg, i) => {
                  const img = getSafeImage(rawImg);
                  const isSelected = selectedImage === img;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      aria-label={`View thumbnail ${i + 1}`}
                      className={`relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden border p-2 bg-white transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "ring-2 ring-skin-terracotta border-skin-terracotta shadow-xs scale-102"
                          : "border-skin-sand/80 hover:border-skin-terracotta/50 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={img}
                          alt={`${product.name} thumbnail ${i + 1}`}
                          fill
                          sizes="80px"
                          className="object-contain"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Formulation Trust Strip */}
            <div className="hidden sm:grid grid-cols-3 gap-3 pt-3 border-t border-skin-sand/50 text-center">
              <div className="p-3 bg-white/70 rounded-2xl border border-skin-sand/50">
                <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-skin-charcoal/40 block mb-1">
                  Purity Standard
                </span>
                <span className="text-xs font-serif font-semibold text-skin-charcoal">
                  100% Clean Actives
                </span>
              </div>
              <div className="p-3 bg-white/70 rounded-2xl border border-skin-sand/50">
                <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-skin-charcoal/40 block mb-1">
                  Safety Verified
                </span>
                <span className="text-xs font-serif font-semibold text-skin-charcoal">
                  Dermatologist Tested
                </span>
              </div>
              <div className="p-3 bg-white/70 rounded-2xl border border-skin-sand/50">
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
            {/* Header: Brand, Category, Title */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/product?search=${encodeURIComponent(product.brand || "SkinAura")}`}
                  className="text-[11px] uppercase tracking-[0.2em] font-bold text-skin-terracotta hover:underline"
                >
                  {product.brand || "SkinAura"}
                </Link>
                {product.category && (
                  <>
                    <span className="text-skin-sand/80">•</span>
                    <Link
                      href={`/product?category=${encodeURIComponent(product.category)}`}
                      className="text-[11px] uppercase tracking-[0.18em] font-medium text-skin-charcoal/50 hover:text-skin-charcoal transition-colors"
                    >
                      {product.category}
                    </Link>
                  </>
                )}
                {product.size && (
                  <>
                    <span className="text-skin-sand/80">•</span>
                    <span className="text-[11px] text-skin-charcoal/50 font-medium">
                      {product.size}
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-skin-charcoal font-medium leading-[1.25] tracking-tight">
                {product.name}
              </h1>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-2 pt-0.5">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={13} className="fill-current mr-0.5" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-skin-charcoal">
                  {Number(product.rating || 4.9).toFixed(1)}
                </span>
                <a
                  href="#reviews-section"
                  className="text-xs text-skin-charcoal/50 hover:text-skin-terracotta underline ml-1"
                >
                  ({product.reviewCount || reviewsList.length || 48} reviews)
                </a>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-skin-sand/70 space-y-2.5 shadow-xs">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-skin-charcoal whitespace-nowrap">
                  ৳ {finalPrice.toFixed(2)}
                </span>
                {product.discount > 0 && (
                  <span className="text-sm sm:text-base text-skin-charcoal/40 line-through font-light whitespace-nowrap">
                    ৳ {originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {savings > 0 && (
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                  <span>Special Offer: You save ৳ {savings.toFixed(2)} ({product.discount}% off)</span>
                </div>
              )}

              {/* Stock status indicator */}
              <div className="pt-2 border-t border-skin-sand/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      product.inStock !== false ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                    }`}
                  />
                  <span className="text-skin-charcoal/80 font-medium">
                    {product.inStock !== false
                      ? "In Stock • Ready to Dispatch"
                      : "Temporarily Out of Stock"}
                  </span>
                </div>
                {product.stock && (
                  <span className="text-[11px] text-skin-charcoal/50">
                    {product.stock} units available
                  </span>
                )}
              </div>
            </div>

            {/* Short Description */}
            {product.description && (
              <p className="text-xs sm:text-sm text-skin-charcoal/75 leading-relaxed font-light font-sans">
                {product.description}
              </p>
            )}

            {/* ── PRODUCT KEY BENEFITS ── */}
            {benefitsList.length > 0 && (
              <div className="p-4 sm:p-4.5 rounded-2xl bg-gradient-to-br from-white via-[#FCFAF7] to-skin-sand/20 border border-skin-sand/80 shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-skin-terracotta/10 text-skin-terracotta flex items-center justify-center shrink-0">
                    <HiSparkles size={12} />
                  </span>
                  <h3 className="text-xs uppercase tracking-[0.16em] font-bold text-skin-charcoal">
                    Key Benefits:
                  </h3>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                  {benefitsList.map((benefit, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-skin-charcoal/85 leading-snug"
                    >
                      <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shrink-0 mt-0.5">
                        <FiCheck size={10} className="stroke-[2.5]" />
                      </span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Selector & Purchase Actions */}
            <div className="space-y-3.5 pt-1">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase font-semibold text-skin-charcoal/60 tracking-wider">
                  Quantity
                </span>
                <div className="flex items-center border border-skin-sand bg-white rounded-xl px-2 py-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || product.inStock === false}
                    aria-label="Decrease quantity"
                    className="w-7 h-7 flex items-center justify-center text-skin-charcoal/60 hover:text-skin-charcoal disabled:opacity-30 cursor-pointer"
                  >
                    <FiMinus size={13} />
                  </button>
                  <span className="w-10 text-center text-xs font-semibold font-mono text-skin-charcoal">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock || 20, q + 1))
                    }
                    disabled={product.inStock === false || quantity >= (product.stock || 20)}
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
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.inStock === false}
                  className={`flex-1 h-12 px-6 rounded-xl text-xs uppercase tracking-[0.16em] font-bold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-sm ${
                    product.inStock !== false
                      ? "bg-skin-charcoal text-white hover:bg-skin-terracotta active:scale-[0.98] hover:shadow-md"
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
                  type="button"
                  onClick={handleInstantBuy}
                  disabled={product.inStock === false}
                  className={`h-12 px-6 rounded-xl text-xs uppercase tracking-[0.16em] font-bold border transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    product.inStock !== false
                      ? "border-skin-charcoal text-skin-charcoal hover:bg-skin-sand/60 active:scale-[0.98]"
                      : "border-skin-sand text-skin-charcoal/30 cursor-not-allowed"
                  }`}
                >
                  Instant Checkout
                </button>
              </div>
            </div>

            {/* Delivery & Assurance Guarantees */}
            <div className="p-4 rounded-2xl bg-white border border-skin-sand/60 space-y-2.5 text-xs text-skin-charcoal/70">
              <div className="flex items-center gap-2.5">
                <FiTruck size={15} className="text-skin-terracotta shrink-0" />
                <span>
                  Complimentary tracked delivery on orders over{" "}
                  <strong className="text-skin-charcoal font-semibold">৳ 2,500</strong>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiShield size={15} className="text-skin-sage shrink-0" />
                <span>100% Authentic Formulation • Dermatologist Approved</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiAward size={15} className="text-amber-600 shrink-0" />
                <span>7-Day Hassle-Free Exchange & Satisfaction Guarantee</span>
              </div>
            </div>

            {/* ── TABS: RITUAL, KEY ACTIVES, SKIN TYPES, SHIPPING ── */}
            <div className="pt-2 border-t border-skin-sand/50 space-y-3">
              {/* Tab navigation */}
              <div className="flex border-b border-skin-sand/60 gap-4 sm:gap-6 overflow-x-auto scrollbar-none">
                {[
                  { id: "description", label: "The Ritual" },
                  { id: "benefits", label: "Key Benefits" },
                  { id: "ingredients", label: "Key Actives" },
                  { id: "skinType", label: "Skin Types" },
                  { id: "shipping", label: "Delivery" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2.5 text-xs tracking-wider uppercase font-semibold transition-all relative cursor-pointer whitespace-nowrap ${
                      activeTab === tab.id
                        ? "text-skin-terracotta"
                        : "text-skin-charcoal/50 hover:text-skin-charcoal"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-skin-terracotta"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="pt-2 min-h-[90px]">
                {activeTab === "description" && (
                  <div className="text-xs sm:text-[13px] text-skin-charcoal/75 leading-relaxed font-light space-y-2.5">
                    <p>
                      {product.shortDescription ||
                        product.description ||
                        "Formulated to replenish vital moisture barriers while defending against daily environmental stressors."}
                    </p>
                    <p className="font-serif italic text-skin-charcoal/70 bg-skin-sand/30 p-3 rounded-xl border border-skin-sand/40">
                      ✦ Recommended Ritual: Dispense an appropriate amount onto cleansed fingertips. Press gently into the face and neck using upward motions until fully absorbed. Follow with your preferred SkinAura moisturizer or night cream.
                    </p>
                  </div>
                )}

                {activeTab === "benefits" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {benefitsList.map((b, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-skin-sand/60 shadow-2xs"
                        >
                          <span className="w-5 h-5 rounded-full bg-skin-terracotta/10 text-skin-terracotta flex items-center justify-center shrink-0 mt-0.5">
                            <HiSparkles size={12} />
                          </span>
                          <span className="text-xs font-semibold text-skin-charcoal leading-snug">
                            {b}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 rounded-xl bg-skin-sand/20 border border-skin-sand/40 text-[11px] text-skin-charcoal/70 flex items-center gap-2">
                      <FiShield className="text-skin-sage shrink-0" size={14} />
                      <span>
                        Formulated with clean, bio-compatible actives to deliver sustained clinical results without compromising sensitive skin barriers.
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === "ingredients" && (
                  <div className="space-y-2.5">
                    {product.ingredients?.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {product.ingredients.map((ing, i) => (
                          <span
                            key={i}
                            className="bg-white border border-skin-sand text-skin-charcoal px-3 py-1 rounded-full text-[11px] font-medium shadow-2xs"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-skin-charcoal/60 font-light">
                        Clinical botanical actives: Ceramides, Hyaluronic Acid, Centella Asiatica, Niacinamide, Botanical Squalane.
                      </p>
                    )}
                    <p className="text-[11px] text-skin-charcoal/50 font-light pt-1">
                      Free of parabens, sulfates, phthalates, synthetic dyes, and artificial fragrances.
                    </p>
                  </div>
                )}

                {activeTab === "skinType" && (
                  <div className="space-y-2.5">
                    {product.skinType?.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {product.skinType.map((st, i) => (
                          <span
                            key={i}
                            className="bg-skin-terracotta/10 text-skin-terracotta font-medium px-3 py-1 rounded-full text-[11px]"
                          >
                            ✓ {st} Skin
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-skin-charcoal/60 font-light">
                        Tested and certified for all skin types, including dry, sensitive, and compromise-prone skin.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "shipping" && (
                  <div className="text-xs text-skin-charcoal/70 space-y-2">
                    <p>• Standard delivery across Bangladesh within 24–48 hours for Dhaka and 2–4 business days for nationwide orders.</p>
                    <p>• Free shipping applied automatically on all orders above ৳ 2,500.</p>
                    <p>• All packages are bubble-sealed in temperature-safe botanical packaging.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── CUSTOMER REVIEWS & RATINGS SECTION ── */}
        <section id="reviews-section" className="pt-12 pb-16 border-t border-skin-sand/60">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-skin-terracotta block mb-1">
                Verified Feedback
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-skin-charcoal font-medium">
                Customer Reviews & Results
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="self-start md:self-end px-5 py-2.5 rounded-xl bg-skin-charcoal text-white hover:bg-skin-terracotta text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-xs cursor-pointer"
            >
              {showReviewForm ? "Cancel Review" : "Write a Review"}
            </button>
          </div>

          {/* Interactive Review Form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleReviewSubmit}
                className="mb-10 p-6 rounded-2xl bg-white border border-skin-sand shadow-sm space-y-4 overflow-hidden"
              >
                <h3 className="text-sm font-semibold text-skin-charcoal tracking-wide">
                  Share Your Experience with {product.name}
                </h3>

                {/* Rating selection */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-skin-charcoal/60">Your Rating:</span>
                  <div className="flex items-center text-amber-500 gap-1 cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="cursor-pointer focus:outline-none"
                      >
                        {star <= newRating ? (
                          <FaStar size={16} className="fill-amber-400" />
                        ) : (
                          <FaRegStar size={16} className="text-skin-sand" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Your Name (e.g., Sarah M.)"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="p-3 text-xs rounded-xl border border-skin-sand focus:border-skin-terracotta focus:outline-none bg-[#FCFAF7]"
                  />
                </div>

                <textarea
                  required
                  rows={3}
                  placeholder="How does this formulation feel on your skin? Share your thoughts..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-skin-sand focus:border-skin-terracotta focus:outline-none bg-[#FCFAF7]"
                />

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-skin-terracotta text-white hover:bg-skin-charcoal text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                >
                  Submit Review
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Rating Breakdown & Reviews List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left summary card */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-skin-sand/70 space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-serif font-bold text-skin-charcoal">
                  {Number(product.rating || 4.9).toFixed(1)}
                </span>
                <span className="text-xs text-skin-charcoal/50">out of 5.0</span>
              </div>

              <div className="flex items-center text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={15} className="fill-current" />
                ))}
              </div>

              <p className="text-xs text-skin-charcoal/60">
                98% of reviewers recommend this formulation for daily use.
              </p>

              <div className="pt-2 border-t border-skin-sand/50 space-y-1.5 text-xs text-skin-charcoal/60">
                <div className="flex items-center justify-between">
                  <span>5 Stars</span>
                  <div className="w-32 h-2 bg-skin-sand rounded-full overflow-hidden">
                    <div className="w-[92%] h-full bg-amber-400 rounded-full" />
                  </div>
                  <span>92%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>4 Stars</span>
                  <div className="w-32 h-2 bg-skin-sand rounded-full overflow-hidden">
                    <div className="w-[6%] h-full bg-amber-400 rounded-full" />
                  </div>
                  <span>6%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>3 Stars</span>
                  <div className="w-32 h-2 bg-skin-sand rounded-full overflow-hidden">
                    <div className="w-[2%] h-full bg-amber-400 rounded-full" />
                  </div>
                  <span>2%</span>
                </div>
              </div>
            </div>

            {/* Right reviews stream */}
            <div className="lg:col-span-8 space-y-4">
              {reviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-white border border-skin-sand/60 space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-skin-charcoal">
                        {rev.author}
                      </span>
                      {rev.verified && (
                        <span className="text-[9.5px] uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                          ✓ Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-skin-charcoal/40 font-light">
                      {rev.date}
                    </span>
                  </div>

                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} size={11} className="fill-current mr-0.5" />
                    ))}
                  </div>

                  <p className="text-xs text-skin-charcoal/75 leading-relaxed font-light">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED PRODUCTS / COMPLETE YOUR RITUAL ── */}
        {relatedProducts.length > 0 && (
          <section className="pt-16 border-t border-skin-sand/60">
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

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard product={rp} key={rp.slug || rp._id || rp.id} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── MOBILE STICKY FLOATING BUY BAR ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-skin-sand/80 px-4 py-3 flex items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-skin-sand/30 border border-skin-sand/50 shrink-0">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-skin-charcoal truncate">
              {product.name}
            </p>
            <p className="text-xs font-bold text-skin-terracotta whitespace-nowrap">
              ৳ {finalPrice.toFixed(2)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.inStock === false}
          className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold shrink-0 transition-all shadow-xs ${
            product.inStock !== false
              ? "bg-skin-charcoal text-white hover:bg-skin-terracotta active:scale-[0.98]"
              : "bg-skin-sand text-skin-charcoal/40"
          }`}
        >
          {addedSuccess ? "Added!" : "Add to Ritual"}
        </button>
      </div>
    </div>
  );
}
