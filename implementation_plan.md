# Implementation Plan - SkinAura Luxury Skincare Redesign

This plan outlines the complete visual and interactive redesign of **SkinAura**, transforming it into a high-end, dermatologist-inspired skincare e-commerce platform. We will move away from generic templates and mismatched boilerplate text to create a cohesive, elegant, and premium user experience.

---

## User Review Required

> [!IMPORTANT]
> **Currency Standardization**
> We found a mix of currencies: USD (`$`) on product lists and details pages, but Euros (`€`) on the cart, checkout, and my-orders pages. We propose standardizing all pages to USD (`$`).
>
> **Card Bubble Fix**
> Currently, the entire `FeaturePDCard` and `ProductCard` are wrapped in Next.js `<Link>` tags. Clicking the "Add to Cart" button triggers navigation to the details page instead of adding the item to the cart. We will fix this by separating the button interaction or using `e.preventDefault()` / `e.stopPropagation()`.

---

## Proposed Changes

### 1. Theme & Design System

We will configure custom design system tokens in Tailwind CSS v4 (within [globals.css](file:///d:/Web%20Development/nextjs-old-project/SkinAura-Ecommerce/app/globals.css)) using CSS custom properties under the `@theme` directive.

*   **Colors**:
    *   `--color-skin-cream`: `#FDFBF7` (soft luxury cream background)
    *   `--color-skin-sand`: `#F5EFE6` (warm beige accents)
    *   `--color-skin-charcoal`: `#242320` (sophisticated soft black for text)
    *   `--color-skin-sage`: `#7D8C77` (dermatologist/organic green)
    *   `--color-skin-terracotta`: `#C68B6E` (warm orange/earthy accent)
    *   `--color-skin-gold`: `#D4AF37` (premium gold highlights)
*   **Typography**:
    *   Use premium serif headings (e.g. Playfair Display or elegant Georgia fallbacks) for section titles and product names.
    *   Use clean sans-serif (Geist) for labels, body copy, and UI controls.
*   **Aesthetics**:
    *   Glassmorphism navbars and dialogs (`backdrop-blur-md bg-white/85`).
    *   Smooth transitions (`transition-all duration-300 ease-in-out`).
    *   Glow shadows (`shadow-md shadow-skin-sand/50`).

---

### 2. Components

We will modify several files to adjust layout styles, images, text content, and interactivity:

#### [MODIFY] [Header.jsx](file:///d:/Web%20Development/nextjs-old-project/SkinAura-Ecommerce/app/components/Header.jsx)
*   Make navbar fixed with glassmorphism backdrop filter (`backdrop-blur-md bg-white/70`).
*   Replace generic colors with sophisticated branding. Add animated hover states to links.
*   Polished shopping cart icon and badge (terracotta or gold).

#### [MODIFY] [HeroBanner.jsx](file:///d:/Web%20Development/nextjs-old-project/SkinAura-Ecommerce/app/components/HeroBanner.jsx)
*   Replace background image with a high-quality aesthetic skincare banner (e.g. serum bottles, dropper in sunlight).
*   Change clothing headline "Comfort Meets Style" to luxurious copy: "Science Meets Radiant Glow" or "Reveal Your Skin's Natural Radiance".
*   Incorporate elegant typography, clean layout, and sophisticated CTA buttons.

#### [MODIFY] [OfferMarquee.jsx](file:///d:/Web%20Development/nextjs-old-project/SkinAura-Ecommerce/app/components/OfferMarquee.jsx)
*   Update background to a soft sand color with charcoal text.
*   Change shoe/electronics offers to organic skincare notifications (e.g., "🧪 100% Dermatologist Approved Ingredients", "✨ Free Shipping on Orders Over $50", "🌱 Cruelty-Free & Vegan Formulations").

#### [MODIFY] [ProductCard.jsx](file:///d:/Web%20Development/nextjs-old-project/SkinAura-Ecommerce/app/components/ProductCard.jsx) & [FeaturePDCard.jsx](file:///d:/Web%20Development/nextjs-old-project/SkinAura-Ecommerce/app/components/FeaturePDCard.jsx)
*   Refactor event handling: prevent card click propagation on the "Add to Cart" button so clicking it adds to cart without triggering details page navigation.
*   Redesign to look like a premium luxury catalog (thin borders, crisp product images, clear rating stars, gold price markers).

#### [MODIFY] [About.jsx](file:///d:/Web%20Development/nextjs-old-project/SkinAura-Ecommerce/app/components/About.jsx)
*   Rewrite the homepage about-us paragraph to focus on skincare rituals, dermatological science, and clean formulas instead of generic corporate templates.
*   Update imagery to represent organic skincare texture or serum application.

#### [MODIFY] [CtaSection.jsx](file:///d:/Web%20Development/nextjs-old-project/SkinAura-Ecommerce/app/components/CtaSection.jsx)
*   Remove broken random unsplash URL.
*   Redesign newsletter subscription with a warm soft sand color block, minimalist rounded inputs, and terracotta/charcoal button.

#### [MODIFY] [Footer.jsx](file:///d:/Web%20Development/nextjs-old-project/SkinAura-Ecommerce/app/components/Footer.jsx)
*   Remove IT/Finance boilerplate columns.
*   Introduce categories (Cleansers, Moisturizers, Serums, Sunscreens), Skincare Science, and Customer Care columns.
*   Update brand description and social links.

---

### 3. Pages

#### [MODIFY] [page.js](file:///d:/Web%20Development/nextjs-old-project/SkinAura-Ecommerce/app/page.js) (Home Page)
*   Clean up section spacing.
*   Enhance section headers with elegant serif styling.
*   Adjust category grid list.

#### [MODIFY] [ProductsPage](file:///d:/Web%20Development/nextjs-old-project/SkinAura-Ecommerce/app/product/page.jsx)
*   Redesign filter sidebar: minimalist checkbox layout, clean reset options.
*   Ensure pagination buttons use the new premium color theme (Sage green/Charcoal instead of blue).

#### [MODIFY] [ProductDetails](file:///d:/Web%20Development/nextjs-old-project/SkinAura-Ecommerce/app/product/%5Bid%5D/page.jsx)
*   Create a clean split layout.
*   Style ingredients and suitability tags as elegant pill-shaped tags (`bg-skin-sand text-skin-charcoal`).
*   Redesign buttons (e.g. solid charcoal "Add to Cart", thin outline "Buy Now").

#### [MODIFY] [Cart](file:///d:/Web%20Development/nextjs-old-project/SkinAura-Ecommerce/app/cart/page.jsx)
*   Replace blue background (`bg-blue-50`) with soft elegant background.
*   Fix currency format to USD.
*   Redesign quantity controls and summary panel.

#### [MODIFY] [Checkout](file:///d:/Web%20Development/nextjs-old-project/SkinAura-Ecommerce/app/cart/checkout/page.jsx)
*   Use standard USD currency.
*   Clean up forms with elegant border states, readable typography, and structured summaries.

#### [MODIFY] [MyOrders](file:///d:/Web%20Development/nextjs-old-project/SkinAura-Ecommerce/app/my-orders/page.jsx)
*   Replace Euros with USD.
*   Clean up order detail cards with structured flex lists.

---

## Verification Plan

### Automated Tests
*   Ensure the Next.js development server builds successfully without errors.
    *   Command: `npm run build`

### Manual Verification
*   **Theme**: Verify page backgrounds, typography, and button hover states match the luxury skincare palette.
*   **Bug Fix**: Test clicking the "Add to Cart" button on both featured and catalog product cards. Confirm the item is added to the cart without navigating to the product page.
*   **Currency**: Check Cart, Checkout, and My Orders pages to ensure all price indicators show `$` (USD).
*   **Interactivity**: Ensure quantity adjustments, cart item removal, and order placement flow are fully functional.
