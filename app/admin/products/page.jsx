"use client";

import React, { useState, useEffect, useRef } from "react";
import api from "../../lib/api";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiBox,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiUploadCloud,
  FiImage,
  FiStar,
  FiLink,
  FiGrid,
} from "react-icons/fi";

// Curated aesthetic skincare image gallery presets
const CURATED_GALLERY = [
  {
    category: "Serums & Oils",
    items: [
      {
        name: "Radiance Niacinamide Serum",
        url: "https://theordinary.com/dw/image/v2/BFKJ_PRD/on/demandware.static/-/Sites-deciem-master/default/dwce8a7cdf/Images/products/The%20Ordinary/rdn-niacinamide-10pct-zinc-1pct-30ml.png",
      },
      {
        name: "AHA 30% Peeling Solution",
        url: "https://theordinary.com/dw/image/v2/BFKJ_PRD/on/demandware.static/-/Sites-deciem-master/default/dwdf7a6213/Images/products/The%20Ordinary/rdn-aha-30pct-bha-2pct-peeling-solution-30ml.png",
      },
      {
        name: "Botanical Elixir Dropper",
        url: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        name: "Amber Facial Oil",
        url: "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        name: "Hyaluronic Glow Dropper",
        url: "https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        name: "Rosehip Seed Nourishing Oil",
        url: "https://images.pexels.com/photos/3738349/pexels-photo-3738349.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
    ],
  },
  {
    category: "Creams & Moistures",
    items: [
      {
        name: "Barrier Restorative Cream",
        url: "https://www.cetaphil.com/dw/image/v2/BGGN_PRD/on/demandware.static/-/Sites-galderma-us-m-catalog/default/dwde5cbd08/Moisturizing%20Cream/052410_MC_16oz-Front.PNG",
      },
      {
        name: "Micro-Sculpting Botanical Cream",
        url: "https://cdn11.bigcommerce.com/s-gud7r2x2lu/images/stencil/640w/products/505/7983/Olay_SI01_EN_MicroSculptingCream_Intro__45171.1749588388.jpg",
      },
      {
        name: "Velvet Cloud Day Cream",
        url: "https://images.pexels.com/photos/3736397/pexels-photo-3736397.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        name: "Ceramide Moisture Balm",
        url: "https://images.pexels.com/photos/3685538/pexels-photo-3685538.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        name: "Nourishing Night Infusion",
        url: "https://images.pexels.com/photos/4465829/pexels-photo-4465829.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
    ],
  },
  {
    category: "Cleansers & Toners",
    items: [
      {
        name: "Hydrating Facial Cleanser",
        url: "https://www.cerave.com/-/media/project/loreal/brand-sites/cerave/americas/us/new-pdp-images/lor2216_hydrating_cleanser_12oz-700x785-v1.jpg",
      },
      {
        name: "Effaclar Purifying Foaming Gel",
        url: "https://www.laroche-posay.us/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-acd-laroche-posay-master-catalog/default/dw5a856f03/img/effaclargelcleanser/effaclar-facial-wash-for-oily-skin-3337872411991-1.jpg",
      },
      {
        name: "Gentle Milky Cleanser",
        url: "https://www.cetaphil.com/dw/image/v2/BGGN_PRD/on/demandware.static/-/Sites-galderma-us-m-catalog/default/dw554054cc/302990100624/GSC-RESIZE-1.2X.png",
      },
      {
        name: "Botanical Purifying Wash",
        url: "https://images.pexels.com/photos/4041391/pexels-photo-4041391.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        name: "Refreshing Calming Toner",
        url: "https://images.pexels.com/photos/4465828/pexels-photo-4465828.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
    ],
  },
  {
    category: "Sunscreen & SPF",
    items: [
      {
        name: "Ultra-Light Invisible Shield SPF 50",
        url: "https://images.ctfassets.net/bcjr30vxh6td/249vyCPCWOePqx9Reg2Y7O/217ce1ad98092d44f138083ad7a1e1c0/6811047_Carousel_1.webp",
      },
      {
        name: "Mineral Glow Sunscreen",
        url: "https://images.ctfassets.net/bcjr30vxh6td/rsxMVyeMGbNsndAZQpHtP/06a1257abd4c07dd6fcb1976cb9f8c57/6868790_Carousel1.webp",
      },
      {
        name: "Daily Defense SPF 40",
        url: "https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
    ],
  },
];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Image Upload & Gallery states
  const [selectedImages, setSelectedImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryCategory, setGalleryCategory] = useState("All");
  const [directUrlInput, setDirectUrlInput] = useState("");
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    brand: "SkinAura",
    category: "Serum",
    subcategory: "",
    slug: "",
    price: "",
    discountPrice: "",
    discount: "",
    stock: "25",
    size: "200ml",
    skinType: "All skin types",
    ingredients: "",
    tags: "",
    rating: "4.8",
    reviewCount: "0",
    isFeatured: false,
    shortDescription: "",
    description: "",
  });

  const handlePriceChange = (newPrice) => {
    const p = parseFloat(newPrice);
    const dp = parseFloat(form.discountPrice);
    let disc = form.discount;
    if (!isNaN(p) && !isNaN(dp) && p > 0 && dp < p) {
      disc = String(Math.round(((p - dp) / p) * 100));
    }
    setForm((prev) => ({ ...prev, price: newPrice, discount: disc }));
  };

  const handleDiscountPriceChange = (newDiscountPrice) => {
    const p = parseFloat(form.price);
    const dp = parseFloat(newDiscountPrice);
    let disc = form.discount;
    if (!isNaN(p) && !isNaN(dp) && p > 0 && dp < p) {
      disc = String(Math.round(((p - dp) / p) * 100));
    } else if (!newDiscountPrice) {
      disc = "";
    }
    setForm((prev) => ({ ...prev, discountPrice: newDiscountPrice, discount: disc }));
  };

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get("/products?limit=100"),
        api.get("/categories"),
      ]);

      if (prodRes.data?.data) {
        setProducts(prodRes.data.data);
      }
      if (catRes.data?.data) {
        setCategories(catRes.data.data);
      }
    } catch (err) {
      console.error("Failed to load products/categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      brand: "SkinAura",
      category: categories[0]?.name || "Serum",
      subcategory: "",
      slug: "",
      price: "",
      discountPrice: "",
      discount: "",
      stock: "25",
      size: "200ml",
      skinType: "All skin types",
      ingredients: "",
      tags: "",
      rating: "4.8",
      reviewCount: "0",
      isFeatured: false,
      shortDescription: "",
      description: "",
    });
    setSelectedImages([]);
    setFeedback({ type: "", message: "" });
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setForm({
      name: p.name || "",
      brand: p.brand || "SkinAura",
      category: p.category || "Serum",
      subcategory: p.subcategory || "",
      slug: p.slug || "",
      price: p.price !== undefined && p.price !== null ? String(p.price) : "",
      discountPrice:
        p.discountPrice !== undefined && p.discountPrice !== null
          ? String(p.discountPrice)
          : "",
      discount:
        p.discount !== undefined && p.discount !== null ? String(p.discount) : "",
      stock: p.stock !== undefined && p.stock !== null ? String(p.stock) : "20",
      size: p.size || "standard",
      skinType: Array.isArray(p.skinType)
        ? p.skinType.join(", ")
        : p.skinType || "All skin types",
      ingredients: Array.isArray(p.ingredients)
        ? p.ingredients.join(", ")
        : p.ingredients || "",
      tags: Array.isArray(p.tags)
        ? p.tags.join(", ")
        : p.tags || "",
      rating: p.rating !== undefined && p.rating !== null ? String(p.rating) : "4.8",
      reviewCount:
        p.reviewCount !== undefined && p.reviewCount !== null
          ? String(p.reviewCount)
          : "0",
      isFeatured: Boolean(p.isFeatured),
      shortDescription: p.shortDescription || "",
      description: p.description || "",
    });
    const imgs = Array.isArray(p.images)
      ? p.images
      : p.images
      ? [p.images]
      : [];
    setSelectedImages(imgs);
    setFeedback({ type: "", message: "" });
    setModalOpen(true);
  };

  // Compress high-res image using HTML5 canvas (reduces 15MB photo to ~150KB)
  const compressImage = (file, maxWidth = 1200, quality = 0.82) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const compressed = canvas.toDataURL("image/jpeg", quality);
          resolve(compressed);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Process files from Drag & Drop or File Input
  const processAndUploadFiles = async (files) => {
    if (!files || files.length === 0) return;
    setUploadingImg(true);
    setFeedback({ type: "", message: "" });

    // Step 1: Attempt to upload to backend server / Cloudinary
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("images", f));

      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.images && res.data.images.length > 0) {
        setSelectedImages((prev) => [...prev, ...res.data.images]);
        setFeedback({
          type: "success",
          message: `${res.data.images.length} image(s) uploaded successfully!`,
        });
        setUploadingImg(false);
        return;
      }
    } catch (err) {
      console.warn("Backend cloud upload error, using instant optimization fallback:", err);
    }

    // Step 2: Instant Local Canvas Compression Fallback
    try {
      const optimizedPromises = files.map((file) => compressImage(file, 1200, 0.82));
      const dataUrls = await Promise.all(optimizedPromises);
      setSelectedImages((prev) => [...prev, ...dataUrls]);
      setFeedback({
        type: "success",
        message: `${dataUrls.length} image(s) optimized & attached successfully!`,
      });
    } catch (err) {
      setFeedback({ type: "error", message: "Failed to optimize image files." });
    } finally {
      setUploadingImg(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length > 0) {
      await processAndUploadFiles(files);
    }
  };

  const handleFileInputChange = async (e) => {
    const files = Array.from(e.target.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length > 0) {
      await processAndUploadFiles(files);
    }
    e.target.value = "";
  };

  // Toggle image selection from curated gallery
  const toggleGalleryImage = (url) => {
    if (selectedImages.includes(url)) {
      setSelectedImages((prev) => prev.filter((img) => img !== url));
    } else {
      setSelectedImages((prev) => [...prev, url]);
    }
  };

  const removeImage = (indexToRemove) => {
    setSelectedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const setAsMainImage = (index) => {
    setSelectedImages((prev) => {
      const item = prev[index];
      const rest = prev.filter((_, idx) => idx !== index);
      return [item, ...rest];
    });
  };

  const handleAddDirectUrl = (e) => {
    e.preventDefault();
    if (!directUrlInput.trim()) return;
    setSelectedImages((prev) => [...prev, directUrlInput.trim()]);
    setDirectUrlInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: "", message: "" });

    try {
      const skinTypeArr =
        typeof form.skinType === "string"
          ? form.skinType.split(",").map((s) => s.trim()).filter(Boolean)
          : Array.isArray(form.skinType)
          ? form.skinType
          : [];

      const ingredientsArr =
        typeof form.ingredients === "string"
          ? form.ingredients.split(",").map((s) => s.trim()).filter(Boolean)
          : Array.isArray(form.ingredients)
          ? form.ingredients
          : [];

      const tagsArr =
        typeof form.tags === "string"
          ? form.tags.split(",").map((s) => s.trim()).filter(Boolean)
          : Array.isArray(form.tags)
          ? form.tags
          : [];

      const payload = {
        name: form.name.trim(),
        brand: form.brand.trim(),
        category: form.category,
        subcategory: form.subcategory ? form.subcategory.trim() : "",
        price: parseFloat(form.price),
        discountPrice:
          form.discountPrice !== "" && !isNaN(Number(form.discountPrice))
            ? parseFloat(form.discountPrice)
            : 0,
        discount:
          form.discount !== "" && !isNaN(Number(form.discount))
            ? parseFloat(form.discount)
            : 0,
        stock: parseInt(form.stock, 10) || 0,
        size: form.size ? form.size.trim() : "standard",
        skinType: skinTypeArr,
        ingredients: ingredientsArr,
        tags: tagsArr,
        rating:
          form.rating !== "" && !isNaN(Number(form.rating))
            ? parseFloat(form.rating)
            : 4.8,
        reviewCount:
          form.reviewCount !== "" && !isNaN(Number(form.reviewCount))
            ? parseInt(form.reviewCount, 10)
            : 0,
        isFeatured: Boolean(form.isFeatured),
        images:
          selectedImages.length > 0
            ? selectedImages
            : [
                "https://images.pexels.com/photos/3736397/pexels-photo-3736397.jpeg",
              ],
        shortDescription: form.shortDescription,
        description: form.description,
      };

      if (form.slug && form.slug.trim()) {
        payload.slug = form.slug.trim().toLowerCase();
      }

      if (editingProduct) {
        await api.patch(`/products/${editingProduct._id || editingProduct.id}`, payload);
        setFeedback({ type: "success", message: "Product updated successfully!" });
      } else {
        await api.post("/products", payload);
        setFeedback({ type: "success", message: "Product created successfully!" });
      }

      await fetchData();
      setTimeout(() => {
        setModalOpen(false);
      }, 700);
    } catch (err) {
      const errorMsg =
        err.response?.data?.errors?.join(", ") ||
        err.response?.data?.message ||
        err.message ||
        "Operation failed";
      setFeedback({
        type: "error",
        message: errorMsg,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Are you sure you want to delete "${p.name}"?`)) return;

    try {
      await api.delete(`/products/${p._id || p.id}`);
      setProducts((prev) => prev.filter((item) => (item._id || item.id) !== (p._id || p.id)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategory === "all" ||
      p.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  // Flat list or filtered list for curated gallery
  const allGalleryItems = CURATED_GALLERY.flatMap((g) => g.items);
  const displayedGalleryItems =
    galleryCategory === "All"
      ? allGalleryItems
      : CURATED_GALLERY.find((g) => g.category.toLowerCase().includes(galleryCategory.toLowerCase()))?.items || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-skin-terracotta">
            Catalog Administration
          </span>
          <h1 className="text-2xl md:text-3xl font-serif text-skin-charcoal mt-1">
            Product Management
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-skin-charcoal hover:bg-skin-terracotta text-white rounded-xl text-xs uppercase tracking-wider font-bold transition shadow-md self-start"
        >
          <FiPlus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-skin-sand/35 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-3.5 text-skin-charcoal/40" size={15} />
          <input
            type="text"
            placeholder="Search formulas by title or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-skin-cream/20 border border-skin-sand/50 rounded-xl focus:outline-none focus:border-skin-terracotta text-skin-charcoal"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-skin-charcoal/60 font-semibold">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-skin-cream/20 border border-skin-sand/50 rounded-xl focus:outline-none text-skin-charcoal"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id || c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-skin-sand/35 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-skin-sand/30 bg-skin-cream/20 text-skin-charcoal/60 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-6 font-semibold">Product</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Price</th>
                <th className="py-3.5 px-4 font-semibold">Stock</th>
                <th className="py-3.5 px-4 font-semibold">Rating</th>
                <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-skin-sand/20">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-skin-charcoal/50">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-skin-charcoal/40">
                    No products found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const stockStatus =
                    p.stock <= 0
                      ? { label: "Out of Stock", class: "bg-red-100 text-red-700" }
                      : p.stock <= 5
                      ? { label: `Low (${p.stock})`, class: "bg-amber-100 text-amber-800" }
                      : { label: `${p.stock} units`, class: "bg-emerald-100 text-emerald-800" };

                  return (
                    <tr key={p._id || p.id} className="hover:bg-skin-cream/10 transition">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-skin-cream/40 border border-skin-sand/30 overflow-hidden flex-shrink-0">
                          <img
                            src={p.images?.[0] || "https://images.pexels.com/photos/3736397/pexels-photo-3736397.jpeg"}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-skin-charcoal line-clamp-1">{p.name}</p>
                          <p className="text-[10px] text-skin-charcoal/50 uppercase tracking-wider">
                            {p.brand || "SkinAura"}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-skin-charcoal font-medium">
                        {p.category}
                      </td>
                      <td className="py-4 px-4 font-semibold text-skin-charcoal">
                        ${p.price?.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${stockStatus.class}`}
                        >
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-skin-charcoal/70">
                        ⭐ {p.rating || "5.0"}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 text-skin-charcoal/70 hover:text-skin-charcoal hover:bg-skin-sand/30 rounded-lg transition"
                          title="Edit Product"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Product"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-skin-charcoal/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 max-h-[92vh] overflow-y-auto shadow-2xl border border-skin-sand/40 space-y-6">
            <div className="flex items-center justify-between border-b border-skin-sand/30 pb-4">
              <div>
                <h3 className="text-xl font-serif text-skin-charcoal">
                  {editingProduct ? "Edit Botanical Formula" : "Add New Botanical Formula"}
                </h3>
                <p className="text-[11px] text-skin-charcoal/50 mt-0.5">
                  Enter formula details and attach high-resolution product imagery
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-skin-charcoal/50 hover:text-skin-charcoal rounded-xl"
              >
                <FiX size={20} />
              </button>
            </div>

            {feedback.message && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  feedback.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {feedback.type === "success" ? <FiCheck size={14} /> : <FiAlertCircle size={14} />}
                {feedback.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Core Information */}
              <div className="space-y-4">
                <h4 className="text-[11px] uppercase tracking-wider font-bold text-skin-charcoal/80 flex items-center gap-1.5 border-b border-skin-sand/20 pb-1.5">
                  <FiBox className="text-skin-terracotta" />
                  Basic Formula Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-skin-cream/20 border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:outline-none"
                      placeholder="e.g. La Roche-Posay Effaclar Gel"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                      Brand *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-skin-cream/20 border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:outline-none"
                      placeholder="e.g. La Roche-Posay"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                        Category *
                      </label>
                      <a
                        href="/admin/categories"
                        target="_blank"
                        className="text-[9px] uppercase tracking-wider font-bold text-skin-terracotta hover:underline"
                      >
                        + Manage Categories
                      </a>
                    </div>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-skin-cream/20 border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c._id || c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                      Subcategory
                    </label>
                    <input
                      type="text"
                      value={form.subcategory}
                      onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-skin-cream/20 border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:outline-none"
                      placeholder="e.g. Acne Control, Hydration, Anti-Aging"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                      Custom URL Slug (Optional)
                    </label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-skin-cream/20 border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:outline-none font-mono"
                      placeholder="e.g. effaclar-gel-cleanser (auto-generated from title if blank)"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing, Discounts & Inventory */}
              <div className="space-y-4">
                <h4 className="text-[11px] uppercase tracking-wider font-bold text-skin-charcoal/80 flex items-center gap-1.5 border-b border-skin-sand/20 pb-1.5">
                  <FiStar className="text-skin-terracotta" />
                  Pricing, Discount & Inventory
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                      Price (USD) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={form.price}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-skin-cream/20 border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:outline-none"
                      placeholder="19.99"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                      Discount Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.discountPrice}
                      onChange={(e) => handleDiscountPriceChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-skin-cream/20 border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:outline-none"
                      placeholder="17.49"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                      Discount %
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={form.discount}
                      onChange={(e) => setForm({ ...form, discount: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-skin-cream/20 border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:outline-none"
                      placeholder="12"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                      Stock Units *
                    </label>
                    <input
                      type="number"
                      required
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-skin-cream/20 border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:outline-none"
                      placeholder="90"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                      Volume / Size
                    </label>
                    <input
                      type="text"
                      value={form.size}
                      onChange={(e) => setForm({ ...form, size: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-skin-cream/20 border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:outline-none"
                      placeholder="e.g. 200ml, 50ml"
                    />
                  </div>
                </div>
              </div>

              {/* Skincare Formula & Botanical Details */}
              <div className="space-y-4">
                <h4 className="text-[11px] uppercase tracking-wider font-bold text-skin-charcoal/80 flex items-center gap-1.5 border-b border-skin-sand/20 pb-1.5">
                  <FiLink className="text-skin-terracotta" />
                  Formula & Skincare Attributes
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                      Skin Types (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={form.skinType}
                      onChange={(e) => setForm({ ...form, skinType: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-skin-cream/20 border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:outline-none"
                      placeholder="Oily, Acne-Prone, Sensitive"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                      Key Ingredients (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={form.ingredients}
                      onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-skin-cream/20 border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:outline-none"
                      placeholder="Salicylic Acid, Zinc PCA"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                      Tags / Keywords (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-skin-cream/20 border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:outline-none"
                      placeholder="oil control, acne treatment"
                    />
                  </div>
                </div>
              </div>

              {/* Showcase & Ratings */}
              <div className="space-y-4">
                <h4 className="text-[11px] uppercase tracking-wider font-bold text-skin-charcoal/80 flex items-center gap-1.5 border-b border-skin-sand/20 pb-1.5">
                  <FiStar className="text-skin-terracotta" />
                  Ratings & Storefront Showcase
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                      Rating (0 to 5.0)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={form.rating}
                      onChange={(e) => setForm({ ...form, rating: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-skin-cream/20 border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:outline-none"
                      placeholder="4.7"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                      Review Count
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.reviewCount}
                      onChange={(e) => setForm({ ...form, reviewCount: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-skin-cream/20 border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:outline-none"
                      placeholder="1100"
                    />
                  </div>

                  <div className="pt-4 sm:pt-3">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none bg-skin-cream/20 hover:bg-skin-cream/35 border border-skin-sand/60 rounded-xl px-3.5 py-2.5 transition">
                      <input
                        type="checkbox"
                        checked={form.isFeatured}
                        onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                        className="w-4 h-4 rounded text-skin-terracotta focus:ring-skin-terracotta/40 accent-skin-terracotta cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-skin-charcoal flex items-center gap-1">
                        ⭐ Feature Formula
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* PRODUCT IMAGES: DRAG & DROP + GALLERY SELECTION */}
              <div className="space-y-3 bg-skin-cream/15 p-4 rounded-2xl border border-skin-sand/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-skin-charcoal flex items-center gap-1.5">
                      <FiImage className="text-skin-terracotta" />
                      Product Imagery ({selectedImages.length} attached)
                    </span>
                    <p className="text-[10px] text-skin-charcoal/50">
                      Drag & drop image files, select from the curated skincare library, or enter a URL
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setGalleryModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-skin-terracotta/15 hover:bg-skin-terracotta/25 text-skin-terracotta rounded-xl text-xs font-bold uppercase tracking-wider transition self-start"
                  >
                    <FiGrid size={13} />
                    <span>Select from Gallery</span>
                  </button>
                </div>

                {/* Drag & Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                    isDragging
                      ? "border-skin-terracotta bg-skin-terracotta/10 scale-[1.01]"
                      : "border-skin-sand hover:border-skin-terracotta/60 bg-white"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />

                  {uploadingImg ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-3 border-skin-terracotta border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs font-semibold text-skin-charcoal">
                        Processing image files...
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-skin-cream/40 flex items-center justify-center text-skin-terracotta">
                        <FiUploadCloud size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-skin-charcoal">
                          Drag & drop product images here, or{" "}
                          <span className="text-skin-terracotta underline">browse from files</span>
                        </p>
                        <p className="text-[10px] text-skin-charcoal/50 mt-0.5">
                          Supports PNG, JPG, JPEG, WEBP (multiple files permitted)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Image URL Quick Input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FiLink className="absolute left-3 top-2.5 text-skin-charcoal/40" size={13} />
                    <input
                      type="text"
                      placeholder="Or paste an image URL here..."
                      value={directUrlInput}
                      onChange={(e) => setDirectUrlInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddDirectUrl}
                    className="px-3.5 py-1.5 bg-skin-charcoal hover:bg-skin-terracotta text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
                  >
                    Add URL
                  </button>
                </div>

                {/* Selected Images Preview Strip */}
                {selectedImages.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-skin-charcoal/50">
                      Attached Photos (First image is Main Cover):
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {selectedImages.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="relative group w-20 h-20 rounded-xl border border-skin-sand/60 bg-white overflow-hidden shadow-sm"
                        >
                          <img
                            src={imgUrl}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Cover badge on first image */}
                          {idx === 0 ? (
                            <span className="absolute top-1 left-1 bg-skin-charcoal/80 text-white text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shadow">
                              Cover
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setAsMainImage(idx)}
                              className="absolute top-1 left-1 bg-white/90 hover:bg-white text-skin-charcoal p-1 rounded-md text-[8px] font-semibold opacity-0 group-hover:opacity-100 transition shadow"
                              title="Set as main cover"
                            >
                              <FiStar size={10} />
                            </button>
                          )}

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow transition opacity-80 group-hover:opacity-100"
                            title="Remove image"
                          >
                            <FiX size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Descriptions */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                  Short Description
                </label>
                <input
                  type="text"
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-skin-cream/20 border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:outline-none"
                  placeholder="Nourishing botanical blend for restorative hydration"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                  Full Botanical Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-skin-cream/20 border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:outline-none"
                  placeholder="Detailed formula information, ingredients, and ritual application guide..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-skin-sand/30">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 text-xs uppercase font-bold tracking-wider text-skin-charcoal hover:bg-skin-sand/20 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 text-xs uppercase font-bold tracking-wider text-white bg-skin-charcoal hover:bg-skin-terracotta rounded-xl transition disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingProduct ? "Update Formula" : "Publish Formula"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CURATED GALLERY PICKER MODAL */}
      {galleryModalOpen && (
        <div className="fixed inset-0 bg-skin-charcoal/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-skin-sand/40 space-y-6">
            <div className="flex items-center justify-between border-b border-skin-sand/30 pb-4">
              <div>
                <h3 className="text-xl font-serif text-skin-charcoal">
                  Skincare Imagery Gallery
                </h3>
                <p className="text-xs text-skin-charcoal/50 mt-0.5">
                  Click any formulation photo to attach or detach it from the product
                </p>
              </div>
              <button
                onClick={() => setGalleryModalOpen(false)}
                className="p-2 text-skin-charcoal/50 hover:text-skin-charcoal rounded-xl"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Gallery Category Filter Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-skin-sand/30 pb-3">
              {["All", "Serums", "Creams", "Cleansers", "Sunscreen"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setGalleryCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition ${
                    galleryCategory === cat
                      ? "bg-skin-charcoal text-white shadow-sm"
                      : "bg-skin-cream/30 text-skin-charcoal/70 hover:bg-skin-sand/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {displayedGalleryItems.map((item, idx) => {
                const isSelected = selectedImages.includes(item.url);

                return (
                  <div
                    key={idx}
                    onClick={() => toggleGalleryImage(item.url)}
                    className={`group relative rounded-2xl border cursor-pointer overflow-hidden transition-all duration-200 ${
                      isSelected
                        ? "border-skin-terracotta ring-2 ring-skin-terracotta shadow-md"
                        : "border-skin-sand/60 hover:border-skin-charcoal/60"
                    }`}
                  >
                    <div className="w-full h-36 bg-skin-cream/20 overflow-hidden relative">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Selection Checkmark Badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-skin-terracotta text-white flex items-center justify-center shadow">
                          <FiCheck size={14} />
                        </div>
                      )}
                    </div>

                    <div className="p-2.5 bg-white">
                      <p className="text-[11px] font-semibold text-skin-charcoal truncate">
                        {item.name}
                      </p>
                      <p className="text-[9px] uppercase tracking-wider text-skin-terracotta font-semibold mt-0.5">
                        {isSelected ? "Selected" : "Click to select"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-skin-sand/30">
              <span className="text-xs font-semibold text-skin-charcoal/60">
                {selectedImages.length} image(s) currently attached
              </span>
              <button
                type="button"
                onClick={() => setGalleryModalOpen(false)}
                className="px-6 py-2.5 bg-skin-charcoal hover:bg-skin-terracotta text-white rounded-xl text-xs uppercase font-bold tracking-wider transition"
              >
                Done Selecting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
