"use client";

import React, { useState, useEffect, useRef } from "react";
import api from "../../lib/api";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSliders,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiUploadCloud,
  FiImage,
  FiLink,
  FiArrowUp,
  FiArrowDown,
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from "react-icons/fi";

// Curated luxury skincare hero presets
const BANNER_PRESETS = [
  {
    name: "Classic Pedestal Set (Slide 1)",
    image: "/hero/hero-slide-1.jpg",
  },
  {
    name: "Radiant Dewy Glow (Slide 2)",
    image: "/hero/hero-slide-2.jpg",
  },
  {
    name: "Botanical Oil & Jar (Slide 3)",
    image: "/hero/hero-slide-3.jpg",
  },
  {
    name: "Golden Botanical Dropper",
    image:
      "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    name: "Minimalist Moisture Creme",
    image:
      "https://images.pexels.com/photos/3736397/pexels-photo-3736397.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    name: "Hydrating Rose Water & Petals",
    image:
      "https://images.pexels.com/photos/4465828/pexels-photo-4465828.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
];

const BADGE_ICONS = [
  { id: "leaf", label: "Leaf (Botanical / Organic)" },
  { id: "bunny", label: "Bunny (Cruelty-Free)" },
  { id: "flask", label: "Flask (Paraben / Science-Clean)" },
  { id: "drop", label: "Drop (Dermatologist / Hydration)" },
  { id: "skin", label: "Skin (For All Skin Types)" },
  { id: "shield", label: "Shield (Barrier Defense)" },
];

const compressImage = (file, maxWidth = 1600, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

const triggerRevalidate = async () => {
  try {
    await fetch("/api/revalidate?tag=banners&path=/", { method: "POST" });
  } catch {
    // best-effort
  }
};

export default function AdminHeroBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Image Upload & Picker states
  const [bannerImage, setBannerImage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [directUrlInput, setDirectUrlInput] = useState("");
  const fileInputRef = useRef(null);

  // Form State
  const [form, setForm] = useState({
    tag: "",
    headlineLine1: "",
    headlineLine2: "",
    description: "",
    primaryCtaLabel: "SHOP NOW",
    primaryCtaHref: "/product",
    secondaryCtaLabel: "",
    secondaryCtaHref: "",
    alt: "",
    isActive: true,
    order: 0,
    trustBadges: [
      { type: "leaf", line1: "NATURAL", line2: "INGREDIENTS" },
      { type: "bunny", line1: "CRUELTY", line2: "FREE" },
      { type: "flask", line1: "PARABEN", line2: "FREE" },
    ],
  });

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await api.get("/banners?all=true");
      if (res.data?.banners || res.data?.data) {
        setBanners(res.data.banners || res.data.data);
      }
    } catch (err) {
      console.error("Failed to load banners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openAddModal = () => {
    setEditingBanner(null);
    setBannerImage("/hero/hero-slide-1.jpg");
    setDirectUrlInput("");
    setFeedback({ type: "", message: "" });
    setForm({
      tag: "NEW ARRIVAL",
      headlineLine1: "Reveal Your",
      headlineLine2: "Natural Beauty",
      description:
        "Premium cosmetics crafted with natural ingredients for healthy, glowing skin.",
      primaryCtaLabel: "SHOP NOW",
      primaryCtaHref: "/product",
      secondaryCtaLabel: "EXPLORE COLLECTION",
      secondaryCtaHref: "/product?sort=newest",
      alt: "SkinAura Luxury Skincare Collection",
      isActive: true,
      order: banners.length,
      trustBadges: [
        { type: "leaf", line1: "NATURAL", line2: "INGREDIENTS" },
        { type: "bunny", line1: "CRUELTY", line2: "FREE" },
        { type: "flask", line1: "PARABEN", line2: "FREE" },
      ],
    });
    setModalOpen(true);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setBannerImage(banner.image || "");
    setDirectUrlInput(banner.image || "");
    setFeedback({ type: "", message: "" });
    setForm({
      tag: banner.tag || "",
      headlineLine1: banner.headlineLine1 || "",
      headlineLine2: banner.headlineLine2 || "",
      description: banner.description || "",
      primaryCtaLabel: banner.primaryCta?.label || "SHOP NOW",
      primaryCtaHref: banner.primaryCta?.href || "/product",
      secondaryCtaLabel: banner.secondaryCta?.label || "",
      secondaryCtaHref: banner.secondaryCta?.href || "",
      alt: banner.alt || "",
      isActive: banner.isActive !== false,
      order: typeof banner.order === "number" ? banner.order : 0,
      trustBadges:
        Array.isArray(banner.trustBadges) && banner.trustBadges.length > 0
          ? banner.trustBadges
          : [
              { type: "leaf", line1: "NATURAL", line2: "INGREDIENTS" },
              { type: "bunny", line1: "CRUELTY", line2: "FREE" },
            ],
    });
    setModalOpen(true);
  };

  // Process file upload
  const processAndUploadFile = async (file) => {
    if (!file) return;
    setUploadingImg(true);
    setFeedback({ type: "", message: "" });

    try {
      const formData = new FormData();
      formData.append("images", file);

      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.images && res.data.images.length > 0) {
        setBannerImage(res.data.images[0]);
        setFeedback({ type: "success", message: "Image uploaded successfully!" });
        setUploadingImg(false);
        return;
      }
    } catch {
      // Local fallback
    }

    try {
      const optimizedDataUrl = await compressImage(file, 1600, 0.85);
      setBannerImage(optimizedDataUrl);
      setFeedback({
        type: "success",
        message: "Image processed & attached successfully!",
      });
    } catch {
      setFeedback({ type: "error", message: "Failed to optimize image file." });
    } finally {
      setUploadingImg(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = Array.from(e.dataTransfer.files).find((f) =>
      f.type.startsWith("image/")
    );
    if (file) {
      await processAndUploadFile(file);
    }
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await processAndUploadFile(file);
    }
    e.target.value = "";
  };

  // Badge list management
  const handleBadgeChange = (index, field, value) => {
    const updated = [...form.trustBadges];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, trustBadges: updated });
  };

  const addBadge = () => {
    if (form.trustBadges.length >= 4) return;
    setForm({
      ...form,
      trustBadges: [
        ...form.trustBadges,
        { type: "drop", line1: "DEEP", line2: "HYDRATION" },
      ],
    });
  };

  const removeBadge = (index) => {
    setForm({
      ...form,
      trustBadges: form.trustBadges.filter((_, i) => i !== index),
    });
  };

  // Save Banner
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: "", message: "" });

    if (!form.headlineLine1.trim()) {
      setFeedback({ type: "error", message: "Headline Line 1 is required." });
      setSubmitting(false);
      return;
    }

    if (!bannerImage) {
      setFeedback({ type: "error", message: "Banner image is required." });
      setSubmitting(false);
      return;
    }

    const payload = {
      tag: form.tag.trim(),
      headlineLine1: form.headlineLine1.trim(),
      headlineLine2: form.headlineLine2.trim(),
      description: form.description.trim(),
      primaryCta: form.primaryCtaLabel.trim()
        ? {
            label: form.primaryCtaLabel.trim(),
            href: form.primaryCtaHref.trim() || "/product",
          }
        : null,
      secondaryCta: form.secondaryCtaLabel.trim()
        ? {
            label: form.secondaryCtaLabel.trim(),
            href: form.secondaryCtaHref.trim() || "/product",
          }
        : null,
      image: bannerImage,
      alt: form.alt.trim() || "SkinAura Banner",
      trustBadges: form.trustBadges,
      isActive: form.isActive,
      order: Number(form.order) || 0,
    };

    try {
      if (editingBanner) {
        await api.patch(`/banners/${editingBanner._id || editingBanner.id}`, payload);
        setFeedback({ type: "success", message: "Banner slide updated successfully!" });
      } else {
        await api.post("/banners", payload);
        setFeedback({ type: "success", message: "Banner slide created successfully!" });
      }

      await triggerRevalidate();
      await fetchBanners();

      setTimeout(() => {
        setModalOpen(false);
      }, 700);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to save banner slide.";
      setFeedback({ type: "error", message: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle active status
  const handleToggleActive = async (banner) => {
    try {
      await api.patch(`/banners/${banner._id || banner.id}/toggle`);
      setBanners((prev) =>
        prev.map((b) =>
          (b._id || b.id) === (banner._id || banner.id)
            ? { ...b, isActive: !b.isActive }
            : b
        )
      );
      await triggerRevalidate();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to toggle status");
    }
  };

  // Delete banner
  const handleDelete = async (banner) => {
    if (!window.confirm("Are you sure you want to delete this hero banner slide?")) {
      return;
    }

    try {
      await api.delete(`/banners/${banner._id || banner.id}`);
      setBanners((prev) =>
        prev.filter((b) => (b._id || b.id) !== (banner._id || banner.id))
      );
      await triggerRevalidate();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete slide");
    }
  };

  // Move slide up / down
  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const newBanners = [...banners];
    const temp = newBanners[index];
    newBanners[index] = newBanners[targetIndex];
    newBanners[targetIndex] = temp;

    setBanners(newBanners);

    try {
      const bannerIds = newBanners.map((b) => b._id || b.id);
      await api.post("/banners/reorder", { bannerIds });
      await triggerRevalidate();
    } catch (err) {
      console.error("Failed to persist order:", err);
      fetchBanners();
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-skin-terracotta">
            Homepage Showcase
          </span>
          <h1 className="text-2xl md:text-3xl font-serif text-skin-charcoal mt-1">
            Hero Slider Management
          </h1>
          <p className="text-xs text-skin-charcoal/60 mt-1 max-w-xl">
            Create, reorder, and customize the luxury slides displayed at the very top of
            the SkinAura storefront.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-skin-charcoal hover:bg-skin-terracotta text-white rounded-full text-xs uppercase tracking-wider font-bold transition duration-300 shadow-md shadow-skin-charcoal/10"
        >
          <FiPlus size={16} />
          <span>Add New Slide</span>
        </button>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-skin-sand/40 p-12 text-center">
          <div className="w-8 h-8 border-3 border-skin-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs uppercase tracking-wider font-semibold text-skin-charcoal/60">
            Loading hero banner slides...
          </p>
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-3xl border border-skin-sand/40 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-skin-sand/30 text-skin-terracotta rounded-full flex items-center justify-center mx-auto">
            <FiSliders size={28} />
          </div>
          <div>
            <h3 className="font-serif text-lg text-skin-charcoal">No Slides Configured</h3>
            <p className="text-xs text-skin-charcoal/60 mt-1">
              Add your first dynamic slide or restore default templates.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-skin-terracotta text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm hover:opacity-95"
          >
            <FiPlus size={16} />
            <span>Create First Slide</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {banners.map((banner, index) => {
            const isFirst = index === 0;
            const isLast = index === banners.length - 1;

            return (
              <div
                key={banner._id || banner.id || index}
                className={`bg-white rounded-2xl border transition-all duration-300 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm hover:shadow-md ${
                  banner.isActive
                    ? "border-skin-sand/40"
                    : "border-red-200 bg-gray-50/50 opacity-75"
                }`}
              >
                {/* Left: Reorder arrows & Slide Thumbnail */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  {/* Reorder Buttons */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => handleMove(index, -1)}
                      disabled={isFirst}
                      title="Move slide up"
                      className={`p-1.5 rounded-lg border text-xs transition ${
                        isFirst
                          ? "border-gray-200 text-gray-300 cursor-not-allowed"
                          : "border-skin-sand hover:bg-skin-sand/30 text-skin-charcoal"
                      }`}
                    >
                      <FiArrowUp size={14} />
                    </button>
                    <span className="text-[11px] font-bold text-skin-charcoal/50">
                      #{index + 1}
                    </span>
                    <button
                      onClick={() => handleMove(index, 1)}
                      disabled={isLast}
                      title="Move slide down"
                      className={`p-1.5 rounded-lg border text-xs transition ${
                        isLast
                          ? "border-gray-200 text-gray-300 cursor-not-allowed"
                          : "border-skin-sand hover:bg-skin-sand/30 text-skin-charcoal"
                      }`}
                    >
                      <FiArrowDown size={14} />
                    </button>
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-28 sm:w-36 h-20 rounded-xl overflow-hidden bg-skin-sand/40 border border-skin-sand/60 shrink-0">
                    <img
                      src={banner.image}
                      alt={banner.alt || "Banner Preview"}
                      className="w-full h-full object-cover object-center"
                    />
                    {!banner.isActive && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-[9px] uppercase font-bold text-white tracking-widest bg-black/60 px-2 py-0.5 rounded">
                          Inactive
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Headline & Tag info */}
                  <div className="min-w-0 flex-1">
                    {banner.tag && (
                      <span className="inline-block text-[10px] font-semibold tracking-[0.18em] uppercase text-[#C5747F] mb-0.5">
                        {banner.tag}
                      </span>
                    )}
                    <h3 className="font-serif text-base sm:text-lg text-skin-charcoal font-medium leading-snug truncate">
                      {banner.headlineLine1} {banner.headlineLine2}
                    </h3>
                    <p className="text-xs text-skin-charcoal/60 line-clamp-1 mt-0.5">
                      {banner.description || "No description copy provided."}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {banner.primaryCta?.label && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#C5747F]/15 text-[#B5636E] font-medium tracking-wider uppercase">
                          CTA 1: {banner.primaryCta.label}
                        </span>
                      )}
                      {banner.secondaryCta?.label && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-skin-sand/60 text-skin-charcoal font-medium tracking-wider uppercase">
                          CTA 2: {banner.secondaryCta.label}
                        </span>
                      )}
                      <span className="text-[10px] text-skin-charcoal/40">
                        {banner.trustBadges?.length || 0} Trust Badges
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleToggleActive(banner)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                      banner.isActive
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                    title={banner.isActive ? "Click to deactivate" : "Click to activate"}
                  >
                    {banner.isActive ? <FiEye size={13} /> : <FiEyeOff size={13} />}
                    <span>{banner.isActive ? "Active" : "Hidden"}</span>
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => openEditModal(banner)}
                    className="p-2 text-skin-charcoal/80 hover:text-skin-charcoal hover:bg-skin-sand/30 rounded-xl transition"
                    title="Edit slide"
                  >
                    <FiEdit2 size={16} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(banner)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                    title="Delete slide"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add / Edit Slide */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-skin-charcoal/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-skin-sand/40 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-skin-sand/30 bg-skin-cream/20 shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-skin-terracotta">
                  {editingBanner ? "Modify Slide" : "New Entry"}
                </span>
                <h2 className="text-xl font-serif text-skin-charcoal">
                  {editingBanner ? "Edit Hero Banner Slide" : "Create Hero Banner Slide"}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-skin-charcoal/50 hover:text-skin-charcoal rounded-full hover:bg-skin-sand/30 transition"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
              {/* Feedback Alert */}
              {feedback.message && (
                <div
                  className={`p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-medium ${
                    feedback.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {feedback.type === "success" ? (
                    <FiCheck size={16} className="shrink-0" />
                  ) : (
                    <FiAlertCircle size={16} className="shrink-0" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}

              {/* LIVE SLIDE PREVIEW */}
              <div className="border border-skin-sand/50 rounded-2xl overflow-hidden shadow-inner bg-[#FBF7F4] p-4 sm:p-6 relative">
                <span className="absolute top-2 right-3 text-[9px] uppercase font-bold tracking-widest text-skin-charcoal/40 bg-white/80 px-2 py-0.5 rounded-full">
                  Real-Time Visual Preview
                </span>

                <div className="relative h-56 sm:h-64 rounded-xl overflow-hidden flex items-center px-6 sm:px-10">
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-no-repeat"
                    style={{
                      backgroundImage: `url('${bannerImage || "/hero/hero-slide-1.jpg"}')`,
                      backgroundPosition: "right 20% center",
                    }}
                  />
                  {/* Ambient Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F3] via-[#FAF6F3]/95 via-60% to-transparent" />

                  {/* Foreground Content */}
                  <div className="relative z-10 max-w-sm">
                    {form.tag && (
                      <span className="text-[#C5747F] text-[10px] font-semibold tracking-[0.2em] uppercase block mb-1">
                        {form.tag}
                      </span>
                    )}
                    <h2 className="font-serif text-[#22201E] text-2xl sm:text-3xl font-normal leading-tight">
                      <span className="block">
                        {form.headlineLine1 || "Reveal Your"}
                      </span>
                      {form.headlineLine2 && (
                        <span className="block">{form.headlineLine2}</span>
                      )}
                    </h2>
                    <p className="text-[#5E5751] text-[11px] sm:text-xs font-light line-clamp-2 mt-1.5 mb-3">
                      {form.description ||
                        "Premium cosmetics crafted with natural ingredients for healthy, glowing skin."}
                    </p>
                    <div className="flex items-center gap-3">
                      {form.primaryCtaLabel && (
                        <span className="px-4 py-1.5 rounded-full bg-[#C5747F] text-white text-[10px] font-semibold tracking-wider uppercase shadow-sm">
                          {form.primaryCtaLabel}
                        </span>
                      )}
                      {form.secondaryCtaLabel && (
                        <span className="text-[10px] font-bold tracking-wider uppercase text-[#23201D] flex items-center gap-1">
                          {form.secondaryCtaLabel}
                          <FiArrowRight size={11} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* IMAGE SELECTION */}
              <div className="space-y-3">
                <label className="block text-xs uppercase font-bold tracking-wider text-skin-charcoal">
                  Slide Photography / Background Image *
                </label>

                {/* Preset Selector Toggle */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPresetsOpen(!presetsOpen)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-skin-sand text-xs font-semibold text-skin-charcoal hover:bg-skin-sand/30 transition"
                  >
                    <FiImage size={14} className="text-skin-terracotta" />
                    <span>Choose from Curated Presets</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImg}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-skin-sand text-xs font-semibold text-skin-charcoal hover:bg-skin-sand/30 transition"
                  >
                    <FiUploadCloud size={14} className="text-skin-terracotta" />
                    <span>{uploadingImg ? "Processing..." : "Upload Image File"}</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>

                {/* Presets Grid */}
                {presetsOpen && (
                  <div className="p-3 bg-skin-sand/20 rounded-2xl border border-skin-sand/50 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {BANNER_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setBannerImage(preset.image);
                          setDirectUrlInput(preset.image);
                          setPresetsOpen(false);
                        }}
                        className={`group relative h-20 rounded-xl overflow-hidden border text-left transition ${
                          bannerImage === preset.image
                            ? "border-skin-terracotta ring-2 ring-skin-terracotta/40"
                            : "border-skin-sand/60 hover:border-skin-terracotta/50"
                        }`}
                      >
                        <img
                          src={preset.image}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5">
                          <p className="text-[10px] text-white font-medium truncate">
                            {preset.name}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Direct URL input */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-skin-charcoal/40">
                      <FiLink size={14} />
                    </span>
                    <input
                      type="text"
                      value={directUrlInput}
                      onChange={(e) => {
                        setDirectUrlInput(e.target.value);
                        setBannerImage(e.target.value);
                      }}
                      placeholder="Paste image URL or /hero/hero-slide-X.jpg"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-skin-sand rounded-xl focus:outline-none focus:border-skin-terracotta"
                    />
                  </div>
                </div>

                {/* Drop Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center transition ${
                    isDragging
                      ? "border-skin-terracotta bg-skin-terracotta/5"
                      : "border-skin-sand/60 hover:border-skin-sand bg-skin-cream/10"
                  }`}
                >
                  <p className="text-[11px] text-skin-charcoal/60">
                    Drag and drop high-res banner photography here, or use the buttons above.
                  </p>
                </div>
              </div>

              {/* HEADLINES & COPY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-skin-charcoal mb-1">
                    Tag / Eyebrow (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    placeholder="e.g. NEW ARRIVAL or ORGANIC FORMULA"
                    className="w-full px-3 py-2 text-xs border border-skin-sand rounded-xl focus:outline-none focus:border-skin-terracotta"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-skin-charcoal mb-1">
                    Alt Text (Accessibility)
                  </label>
                  <input
                    type="text"
                    value={form.alt}
                    onChange={(e) => setForm({ ...form, alt: e.target.value })}
                    placeholder="e.g. SkinAura Serum and moisturizer set"
                    className="w-full px-3 py-2 text-xs border border-skin-sand rounded-xl focus:outline-none focus:border-skin-terracotta"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-skin-charcoal mb-1">
                    Headline Line 1 *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.headlineLine1}
                    onChange={(e) => setForm({ ...form, headlineLine1: e.target.value })}
                    placeholder="e.g. Reveal Your"
                    className="w-full px-3 py-2 text-xs border border-skin-sand rounded-xl focus:outline-none focus:border-skin-terracotta font-serif text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-skin-charcoal mb-1">
                    Headline Line 2
                  </label>
                  <input
                    type="text"
                    value={form.headlineLine2}
                    onChange={(e) => setForm({ ...form, headlineLine2: e.target.value })}
                    placeholder="e.g. Natural Beauty"
                    className="w-full px-3 py-2 text-xs border border-skin-sand rounded-xl focus:outline-none focus:border-skin-terracotta font-serif text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase font-bold tracking-wider text-skin-charcoal mb-1">
                    Description / Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief poetic sentence about the formulation or ritual..."
                    className="w-full px-3 py-2 text-xs border border-skin-sand rounded-xl focus:outline-none focus:border-skin-terracotta resize-none"
                  />
                </div>
              </div>

              {/* CALLS TO ACTION (CTAS) */}
              <div className="border-t border-skin-sand/30 pt-4 space-y-4">
                <h4 className="text-xs uppercase font-bold tracking-wider text-skin-charcoal">
                  Action Buttons (CTAs)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-skin-sand/15 p-4 rounded-2xl">
                  {/* Primary CTA */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-[#C5747F] uppercase tracking-wider block">
                      Primary Pill Button
                    </span>
                    <input
                      type="text"
                      value={form.primaryCtaLabel}
                      onChange={(e) =>
                        setForm({ ...form, primaryCtaLabel: e.target.value })
                      }
                      placeholder="Label (e.g. SHOP NOW)"
                      className="w-full px-3 py-2 text-xs border border-skin-sand rounded-xl bg-white focus:outline-none focus:border-skin-terracotta"
                    />
                    <input
                      type="text"
                      value={form.primaryCtaHref}
                      onChange={(e) =>
                        setForm({ ...form, primaryCtaHref: e.target.value })
                      }
                      placeholder="Link Destination (e.g. /product)"
                      className="w-full px-3 py-2 text-xs border border-skin-sand rounded-xl bg-white focus:outline-none focus:border-skin-terracotta"
                    />
                  </div>

                  {/* Secondary CTA */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-skin-charcoal/70 uppercase tracking-wider block">
                      Secondary Text Link (Optional)
                    </span>
                    <input
                      type="text"
                      value={form.secondaryCtaLabel}
                      onChange={(e) =>
                        setForm({ ...form, secondaryCtaLabel: e.target.value })
                      }
                      placeholder="Label (e.g. EXPLORE COLLECTION)"
                      className="w-full px-3 py-2 text-xs border border-skin-sand rounded-xl bg-white focus:outline-none focus:border-skin-terracotta"
                    />
                    <input
                      type="text"
                      value={form.secondaryCtaHref}
                      onChange={(e) =>
                        setForm({ ...form, secondaryCtaHref: e.target.value })
                      }
                      placeholder="Link Destination (e.g. /product?sort=newest)"
                      className="w-full px-3 py-2 text-xs border border-skin-sand rounded-xl bg-white focus:outline-none focus:border-skin-terracotta"
                    />
                  </div>
                </div>
              </div>

              {/* TRUST BADGES BUILDER */}
              <div className="border-t border-skin-sand/30 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-skin-charcoal">
                    Trust Badges (Botanical & Clinical Accreditations)
                  </h4>
                  {form.trustBadges.length < 4 && (
                    <button
                      type="button"
                      onClick={addBadge}
                      className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-skin-terracotta hover:underline"
                    >
                      <FiPlus size={13} />
                      <span>Add Badge</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {form.trustBadges.map((badge, bIndex) => (
                    <div
                      key={bIndex}
                      className="p-3 bg-white border border-skin-sand/60 rounded-xl space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-skin-charcoal/50">
                          Badge #{bIndex + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeBadge(bIndex)}
                          className="text-red-400 hover:text-red-600 p-1"
                        >
                          <FiX size={14} />
                        </button>
                      </div>

                      <select
                        value={badge.type}
                        onChange={(e) =>
                          handleBadgeChange(bIndex, "type", e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 text-xs border border-skin-sand rounded-lg focus:outline-none focus:border-skin-terracotta"
                      >
                        {BADGE_ICONS.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.label}
                          </option>
                        ))}
                      </select>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={badge.line1}
                          onChange={(e) =>
                            handleBadgeChange(bIndex, "line1", e.target.value)
                          }
                          placeholder="Line 1 (e.g. NATURAL)"
                          className="px-2 py-1 text-xs border border-skin-sand rounded-lg focus:outline-none focus:border-skin-terracotta uppercase"
                        />
                        <input
                          type="text"
                          value={badge.line2}
                          onChange={(e) =>
                            handleBadgeChange(bIndex, "line2", e.target.value)
                          }
                          placeholder="Line 2 (e.g. INGREDIENTS)"
                          className="px-2 py-1 text-xs border border-skin-sand rounded-lg focus:outline-none focus:border-skin-terracotta uppercase"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SETTINGS: ACTIVE & ORDER */}
              <div className="border-t border-skin-sand/30 pt-4 flex flex-wrap items-center justify-between gap-4">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-skin-terracotta focus:ring-skin-terracotta"
                  />
                  <span className="text-xs font-semibold text-skin-charcoal">
                    Slide Active & Visible on Storefront
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-xs uppercase font-bold text-skin-charcoal/60">
                    Order Index:
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-16 px-2.5 py-1 text-xs border border-skin-sand rounded-lg focus:outline-none focus:border-skin-terracotta"
                  />
                </div>
              </div>

              {/* MODAL ACTIONS */}
              <div className="border-t border-skin-sand/30 pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-skin-sand text-xs uppercase tracking-wider font-semibold text-skin-charcoal hover:bg-skin-sand/20 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-skin-charcoal hover:bg-skin-terracotta text-white text-xs uppercase tracking-wider font-bold transition duration-300 shadow-md shadow-skin-charcoal/10 disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : editingBanner
                    ? "Save Changes"
                    : "Create Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
