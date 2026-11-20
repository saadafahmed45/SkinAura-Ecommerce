"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { FiShoppingBag, FiHeart, FiZap } from "react-icons/fi";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  if (!product) return null;

  const {
    id,
    _id,
    slug,
    name,
    price,
    discountPrice,
    discount,
    images,
    rating,
    reviewCount,
    inStock,
    brand,
    category,
  } = product;

  const productSlug = slug || _id || id;
  const defaultFallback =
    "https://images.pexels.com/photos/3762756/pexels-photo-3762756.jpeg";

  const getSafeImage = (url) => {
    if (!url || typeof url !== "string") return defaultFallback;
    if (url.includes("laroche-posay.us")) return defaultFallback;
    if (url.includes("bioderma.co.uk"))
      return "https://images.pexels.com/photos/3736398/pexels-photo-3736398.jpeg";
    return url;
  };

  const displayImage = getSafeImage(
    images?.[0] || product.image || defaultFallback,
  );
  const [imgSrc, setImgSrc] = useState(displayImage);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setImgSrc(getSafeImage(images?.[0] || product.image || defaultFallback));
  }, [images, product.image]);

  const router = useRouter();
  const { handleAddedCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddedCart(product);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddedCart(product, 1, true);
    router.push("/cart");
  };

  const finalPrice = discount > 0 ? discountPrice : price;
  const brandDisplay = brand || category || "Botanical";

  return (
    <div className="group bg-white rounded-2xl border border-skin-sand/70 hover:border-skin-terracotta/40 hover:shadow-xl hover:shadow-skin-terracotta/10 transition-all duration-300 flex flex-col justify-between overflow-hidden h-full">
      <div className="flex flex-col flex-1">
        {/* Product Image Area - Clean Responsive Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-white p-3 sm:p-4 flex items-center justify-center border-b border-skin-sand/35">
          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap items-center gap-1 pointer-events-none max-w-[70%]">
            {discount > 0 && (
              <span className="bg-skin-terracotta text-white text-[9px] sm:text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                -{discount}%
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-skin-charcoal text-white text-[8.5px] sm:text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                Featured
              </span>
            )}
            {product.isTopSelling && !product.isFeatured && (
              <span className="bg-skin-charcoal text-white text-[8.5px] sm:text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                Top Seller
              </span>
            )}
            {!inStock && (
              <span className="bg-skin-charcoal/80 text-white text-[8.5px] sm:text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                Sold Out
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer ${
              isWishlisted
                ? "bg-skin-terracotta text-white"
                : "bg-skin-sand/60 hover:bg-white text-skin-charcoal/50 hover:text-skin-terracotta"
            }`}
          >
            <FiHeart
              size={13}
              className={
                isWishlisted
                  ? "fill-current"
                  : "transition-transform group-hover:scale-110"
              }
            />
          </button>

          {/* Image */}
          <Link
            href={`/product/${productSlug}`}
            className="block relative w-full h-full"
          >
            <Image
              src={imgSrc}
              alt={name || "Product"}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain transition-transform duration-500 ease-out group-hover:scale-106"
              loading="lazy"
              onError={() => setImgSrc(defaultFallback)}
            />
          </Link>
        </div>

        {/* Product Details Area */}
        <div className="p-3 sm:p-4 pt-2.5 sm:pt-3 space-y-1.5 sm:space-y-2 flex-1 flex flex-col justify-between">
          <div>
            {/* Brand & Rating Header Line */}
            <div className="flex items-center justify-between text-[10px] sm:text-[10.5px] uppercase tracking-wider font-bold mb-1">
              <span className="text-skin-terracotta truncate max-w-[60%]">
                {brandDisplay}
              </span>
              {rating > 0 && (
                <div className="flex items-center gap-1 text-skin-charcoal/70 font-semibold normal-case tracking-normal text-xs shrink-0">
                  <FaStar className="text-amber-400 text-[10px]" />
                  <span>{Number(rating).toFixed(1)}</span>
                  {reviewCount > 0 && (
                    <span className="text-skin-charcoal/40 font-light text-[10px]">
                      ({reviewCount})
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Product Name */}
            <Link href={`/product/${productSlug}`} className="block group/title">
              <h3 className="text-[13.5px] sm:text-[14.5px] font-serif text-skin-charcoal group-hover/title:text-skin-terracotta transition-colors line-clamp-2 min-h-[2.3rem] sm:min-h-[2.5rem] font-medium leading-snug">
                {name}
              </h3>
            </Link>
          </div>

          {/* Price Line (Clean single line) */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 pt-1">
            <span className="text-base sm:text-lg font-bold text-skin-charcoal whitespace-nowrap">
              ৳ {Number(finalPrice || 0).toFixed(2)}
            </span>
            {discount > 0 && (
              <span className="text-[11px] sm:text-xs text-skin-charcoal/40 line-through whitespace-nowrap font-light">
                ৳ {Number(price || 0).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons: Add to Cart & Buy Now */}
      <div className="px-3 pb-3 sm:px-4 sm:pb-4 pt-0 mt-auto">
        {inStock ? (
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={`Add ${name} to cart`}
              title="Add to Cart"
              className="h-9 sm:h-10 px-1.5 sm:px-2 rounded-xl text-[10px] sm:text-[11px] uppercase tracking-wider font-bold transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer border border-skin-sand bg-skin-cream/40 text-skin-charcoal hover:bg-skin-sand/60 hover:border-skin-terracotta/40 active:scale-[0.98] whitespace-nowrap shadow-2xs"
            >
              <FiShoppingBag size={13} className="shrink-0 transition-transform group-hover:scale-110" />
              <span>Add<span className="hidden sm:inline"> to Cart</span></span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              aria-label={`Buy ${name} now`}
              title="Buy Now"
              className="h-9 sm:h-10 px-1.5 sm:px-2 rounded-xl text-[10px] sm:text-[11px] uppercase tracking-wider font-bold transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer bg-skin-charcoal text-white hover:bg-skin-terracotta active:scale-[0.98] shadow-xs hover:shadow-md whitespace-nowrap"
            >
              <FiZap size={12} className="shrink-0 text-amber-300" />
              <span>Buy Now</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled
            className="w-full h-9 sm:h-10 px-3 rounded-xl text-[11px] sm:text-xs uppercase tracking-wider font-bold bg-skin-sand text-skin-charcoal/40 cursor-not-allowed flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <FiShoppingBag size={14} className="shrink-0" />
            <span>Out of Stock</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
