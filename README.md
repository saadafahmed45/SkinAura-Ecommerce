{"variant":"standard","title":"README for Glow Haven","id":"53901"}
# Glow Haven — Skincare eCommerce (Next.js + Tailwind)

A modern, responsive skincare storefront built with Next.js (App Router), React, and Tailwind CSS. Ships with a local product API (`/app/api/skinData.js`) containing curated skincare items (cleansers, serums, creams, sunscreens, K-Beauty, etc.), category pages, and premium product cards.

---

## 🚀 Features

- Local products data (`skincareProducts`) ready for development and demos  
- Dynamic product pages (`/product/[id]` or `/product/[slug]`)  
- Category pages (`/category/[slug]`) with breadcrumb navigation  
- Premium product cards with hover effects, badges, ratings, and Add-to-Cart UI  
- Responsive layout (mobile → desktop) using Tailwind CSS  
- Easy to extend: add products, categories, filters, or cart logic (Context API)

---

## 🧩 Tech Stack

- Next.js (App Router)  
- React (client & server components)  
- Tailwind CSS  
- react-icons (icons)  
- Axios (optional — for external APIs)  
- Local JS data files for product and category APIs



## 🧭 Routing Notes (App Router)

- **Server components**: prefer `async function Page({ params }) { const { id } = await params }` (unwrap params)  
- **Client components**: use `use(params)` to unwrap promise when needed, or pass params from server → client.  
- Avoid accessing `params.id` directly in client components due to Next.js updates.

---

## ✨ UI / UX Tips

- Use `line-clamp` for titles to keep cards tidy.  
- Lazy-load large images (or use `next/image` when deploying).  
- Add skeleton loaders for product lists.  
- Implement cart with Context API and persist to localStorage.

---

## 🤝 Contributing

1. Fork the repo  
2. Create a feature branch (`git checkout -b feat/awesome`)  
3. Commit your changes (`git commit -m "feat: add ..."` )  
4. Push and open a Pull Request

Please keep code style consistent (Tailwind utility classes, small components, clear prop types).

---
