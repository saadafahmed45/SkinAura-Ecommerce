"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { FiShoppingBag, FiHeart } from "react-icons/fi";
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
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setImgSrc(getSafeImage(images?.[0] || product.image || defaultFallback));
  }, [images, product.image]);

  const { handleAddedCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddedCart(product);
  };

  const finalPrice = discount > 0 ? discountPrice : price;
  const brandDisplay = brand || category || "Botanical";

  return (
    <div className="group bg-white rounded-2xl border border-skin-sand/60 hover:border-skin-terracotta/40 hover:shadow-xl hover:shadow-skin-terracotta/8 transition-all duration-400 flex flex-col justify-between overflow-hidden h-full">
      <div>
        {/* Product Image Area - Seamless Pure White Canvas */}
        <div className="relative aspect-square w-full overflow-hidden bg-white p-4 sm:p-5 flex items-center justify-center border-b border-skin-sand/35">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5 pointer-events-none">
            {discount > 0 && (
              <span className="bg-skin-terracotta text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                -{discount}%
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-skin-charcoal text-white text-[9.5px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                Featured
              </span>
            )}
            {product.isTopSelling && !product.isFeatured && (
              <span className="bg-skin-charcoal text-white text-[9.5px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                Top Seller
              </span>
            )}
            {!inStock && (
              <span className="bg-skin-charcoal/80 text-white text-[9.5px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
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
            className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer ${
              isWishlisted
                ? "bg-skin-terracotta text-white"
                : "bg-skin-sand/50 hover:bg-white text-skin-charcoal/45 hover:text-skin-terracotta"
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

        {/* Product Details */}
        <div className="p-4 pt-3.5 space-y-2">
          {/* Brand & Rating Header Line */}
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-bold">
            <span className="text-skin-terracotta truncate max-w-[65%]">
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
          <Link href={`/product/${productId}`} className="block group/title">
            <h3 className="text-[14.5px] sm:text-[15px] font-serif text-skin-charcoal group-hover/title:text-skin-terracotta transition-colors line-clamp-2 min-h-[2.6rem] font-medium leading-snug">
              {name}
            </h3>
          </Link>

          {/* Price (Dedicated line - NEVER wraps) */}
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-lg font-bold text-skin-charcoal whitespace-nowrap">
              ৳ {Number(finalPrice || 0).toFixed(2)}
            </span>
            {discount > 0 && (
              <span className="text-xs text-skin-charcoal/40 line-through whitespace-nowrap font-light">
                ৳ {Number(price || 0).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Button: Luxury Solid Charcoal to Terracotta */}
      <div className="px-4 pb-4 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          aria-label={`Add ${name} to cart`}
          className={`w-full py-2.5 rounded-xl text-xs uppercase tracking-[0.16em] font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
            inStock
              ? "bg-skin-charcoal text-white hover:bg-skin-terracotta active:scale-[0.98] hover:shadow-md"
              : "bg-skin-sand text-skin-charcoal/40 cursor-not-allowed"
          }`}
        >
          <FiShoppingBag
            size={13}
            className="transition-transform group-hover:scale-110"
          />
          <span>{inStock ? "Add to Cart" : "Out of Stock"}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
