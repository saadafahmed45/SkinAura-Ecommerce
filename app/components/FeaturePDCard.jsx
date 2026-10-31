"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { FiShoppingBag, FiHeart } from "react-icons/fi";
import { useCart } from "../context/CartContext";

const FeaturePDCard = ({ product }) => {
  if (!product) return null;

  const {
    id,
    _id,
    slug,
    name,
    price,
    discountPrice,
    discount,
    rating,
    images,
    createdAt,
    brand,
    reviewCount,
    inStock,
  } = product;

  const productId = _id || id || slug;
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
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    setImgSrc(getSafeImage(images?.[0] || product.image || defaultFallback));
  }, [images, product.image]);

  const { handleAddedCart } = useCart();

  const isNew =
    new Date().getTime() - new Date(createdAt).getTime() <
    1000 * 60 * 60 * 24 * 30;

  const finalPrice = discount > 0 ? discountPrice : price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddedCart(product);
  };

  return (
    <div className="group bg-white rounded-2xl border border-skin-sand/70 hover:border-skin-terracotta/40 hover:shadow-xl hover:shadow-skin-terracotta/10 transition-all duration-300 flex flex-col justify-between overflow-hidden h-full">
      <div className="flex flex-col flex-1">
        {/* IMAGE AREA - Clean Responsive Canvas */}
        <div className="relative aspect-square w-full overflow-hidden bg-white p-3 sm:p-4 flex items-center justify-center border-b border-skin-sand/35">
          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap items-center gap-1 pointer-events-none max-w-[70%]">
            {discount > 0 && (
              <span className="bg-skin-terracotta text-white text-[9px] sm:text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                -{discount}%
              </span>
            )}
            {isNew && (
              <span className="bg-skin-charcoal text-white text-[8.5px] sm:text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                New
              </span>
            )}
            {inStock === false && (
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
              setWishlist(!wishlist);
            }}
            aria-label={wishlist ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer ${
              wishlist
                ? "bg-skin-terracotta text-white"
                : "bg-skin-sand/60 hover:bg-white text-skin-charcoal/50 hover:text-skin-terracotta"
            }`}
          >
            <FiHeart
              size={13}
              className={
                wishlist
                  ? "fill-current"
                  : "transition-transform group-hover:scale-110"
              }
            />
          </button>

          {/* Image */}
          <Link
            href={`/product/${productId}`}
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

        {/* CONTENT */}
        <div className="p-3 sm:p-4 pt-2.5 sm:pt-3 space-y-1.5 sm:space-y-2 flex-1 flex flex-col justify-between">
          <div>
            {/* Brand & Rating Header Line */}
            <div className="flex items-center justify-between text-[10px] sm:text-[10.5px] uppercase tracking-wider font-bold mb-1">
              <span className="text-skin-terracotta truncate max-w-[60%]">
                {brand || "Botanical"}
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
            <Link href={`/product/${productId}`} className="block group/title">
              <h3 className="text-[13.5px] sm:text-[14.5px] font-serif text-skin-charcoal group-hover/title:text-skin-terracotta transition-colors line-clamp-2 min-h-[2.3rem] sm:min-h-[2.5rem] font-medium leading-snug">
                {name}
              </h3>
            </Link>
          </div>

          {/* Price Line */}
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

      {/* Action Button: Luxury Solid Charcoal to Terracotta - Never wraps */}
      <div className="px-3 pb-3 sm:px-4 sm:pb-4 pt-0 mt-auto">
        <button
          onClick={handleAddToCart}
          disabled={inStock === false}
          aria-label={`Add ${name} to cart`}
          className={`w-full h-9 sm:h-10 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs uppercase tracking-wider font-bold transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-xs whitespace-nowrap ${
            inStock !== false
              ? "bg-skin-charcoal text-white hover:bg-skin-terracotta active:scale-[0.98] hover:shadow-md"
              : "bg-skin-sand text-skin-charcoal/40 cursor-not-allowed"
          }`}
        >
          <FiShoppingBag
            size={14}
            className="shrink-0 transition-transform group-hover:scale-110"
          />
          <span className="whitespace-nowrap">{inStock !== false ? "Add to Cart" : "Out of Stock"}</span>
        </button>
      </div>
    </div>
  );
};

export default FeaturePDCard;
