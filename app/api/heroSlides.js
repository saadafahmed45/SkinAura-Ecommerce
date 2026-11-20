export const fallbackSlides = [
  {
    id: 1,
    tag: null,
    headlineLine1: "Reveal Your",
    headlineLine2: "Natural Beauty",
    description:
      "Premium cosmetics crafted with natural ingredients for healthy, glowing skin.",
    primaryCta: { label: "SHOP NOW", href: "/product" },
    secondaryCta: null,
    image: "/hero/hero-slide-1.jpg",
    alt: "Aura Skincare luxury cosmetics set with gentle cleanser, rose water toner, luminous moisture cream and bloom serum on stone pedestal",
    trustBadges: [
      {
        type: "leaf",
        line1: "NATURAL",
        line2: "INGREDIENTS",
      },
      {
        type: "bunny",
        line1: "CRUELTY",
        line2: "FREE",
      },
      {
        type: "flask",
        line1: "PARABEN",
        line2: "FREE",
      },
    ],
  },
  {
    id: 2,
    tag: "NEW ARRIVAL",
    headlineLine1: "Glow Naturally.",
    headlineLine2: "Shine Confidently.",
    description:
      "Skincare and beauty essentials that bring out your natural radiance.",
    primaryCta: { label: "SHOP NOW", href: "/product" },
    secondaryCta: { label: "EXPLORE COLLECTION", href: "/product?sort=newest" },
    image: "/hero/hero-slide-2.jpg",
    alt: "Smiling woman with radiant dewy skin touching cheek next to Aura Skincare Radiance Boost serum on travertine pedestal",
    trustBadges: [
      {
        type: "leaf",
        line1: "Clean",
        line2: "Ingredients",
      },
      {
        type: "bunny",
        line1: "Cruelty",
        line2: "Free",
      },
      {
        type: "drop",
        line1: "Dermatologist",
        line2: "Tested",
      },
      {
        type: "skin",
        line1: "For All",
        line2: "Skin Types",
      },
    ],
  },
  {
    id: 3,
    tag: "ORGANIC FORMULA",
    headlineLine1: "Nourish Deeply.",
    headlineLine2: "Bloom Gracefully.",
    description:
      "Restorative botanical face oils and velvety hydrating creams designed to replenish and strengthen your barrier.",
    primaryCta: { label: "SHOP NOW", href: "/product" },
    secondaryCta: { label: "VIEW ROUTINE", href: "/category" },
    image: "/hero/hero-slide-3.jpg",
    alt: "Aura Skincare restorative face oil and hydrating creme jar on textured travertine stone with eucalyptus and rose petals",
    trustBadges: [
      {
        type: "leaf",
        line1: "100% Organic",
        line2: "Botanicals",
      },
      {
        type: "drop",
        line1: "Deep Moisture",
        line2: "Hydration",
      },
      {
        type: "bunny",
        line1: "Cruelty",
        line2: "Free",
      },
      {
        type: "shield",
        line1: "Skin Barrier",
        line2: "Defense",
      },
    ],
  },
];

/**
 * Normalizes banner slide to guarantee all required UI properties exist
 */
export const normalizeBanner = (banner, index = 0) => {
  if (!banner) return null;

  const id = banner._id || banner.id || `slide-${index + 1}`;
  let line1 = banner.headlineLine1;
  let line2 = banner.headlineLine2;

  // Fallback if full headline provided instead of separate lines
  if (!line1 && banner.title) {
    const parts = banner.title.split("\n");
    line1 = parts[0] || "";
    line2 = parts[1] || "";
  }

  return {
    id,
    _id: banner._id || id,
    tag: banner.tag || null,
    headlineLine1: line1 || "Reveal Your",
    headlineLine2: line2 || "Natural Beauty",
    description: banner.description || "",
    primaryCta: banner.primaryCta?.label
      ? {
          label: banner.primaryCta.label,
          href: banner.primaryCta.href || "/product",
        }
      : { label: "SHOP NOW", href: "/product" },
    secondaryCta: banner.secondaryCta?.label
      ? {
          label: banner.secondaryCta.label,
          href: banner.secondaryCta.href || "/product",
        }
      : null,
    image: banner.image || "/hero/hero-slide-1.jpg",
    alt: banner.alt || "SkinAura Luxury Skincare Banner",
    trustBadges:
      Array.isArray(banner.trustBadges) && banner.trustBadges.length > 0
        ? banner.trustBadges
        : [
            { type: "leaf", line1: "NATURAL", line2: "INGREDIENTS" },
            { type: "bunny", line1: "CRUELTY", line2: "FREE" },
            { type: "flask", line1: "PARABEN", line2: "FREE" },
          ],
    order: typeof banner.order === "number" ? banner.order : index,
    isActive: banner.isActive !== false,
  };
};
