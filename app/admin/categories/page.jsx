"use client";

import React, { useState, useEffect, useRef } from "react";
import api from "../../lib/api";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiLayers,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiUploadCloud,
  FiImage,
  FiLink,
  FiGrid,
  FiExternalLink,
} from "react-icons/fi";
import Link from "next/link";

// Curated aesthetic category cover photo presets
const CATEGORY_PRESETS = [
  {
    name: "Serums & Essences",
    image: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Creams & Moistures",
    image: "https://images.pexels.com/photos/3736397/pexels-photo-3736397.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Cleansers & Washes",
    image: "https://images.pexels.com/photos/4041391/pexels-photo-4041391.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Toners & Mists",
    image: "https://images.pexels.com/photos/4465828/pexels-photo-4465828.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Sunscreen & SPF",
    image: "https://images.ctfassets.net/bcjr30vxh6td/249vyCPCWOePqx9Reg2Y7O/217ce1ad98092d44f138083ad7a1e1c0/6811047_Carousel_1.webp",
  },
  {
    name: "Botanical Oils",
    image: "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Eye Treatments",
    image: "https://images.pexels.com/photos/3685538/pexels-photo-3685538.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Masks & Peels",
    image: "https://images.pexels.com/photos/3738349/pexels-photo-3738349.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Image states
  const [categoryImage, setCategoryImage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [directUrlInput, setDirectUrlInput] = useState("");
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      if (res.data?.categories || res.data?.data) {
        setCategories(res.data.categories || res.data.data);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setForm({
      name: "",
      description: "",
    });
    setCategoryImage(CATEGORY_PRESETS[0].image);
    setFeedback({ type: "", message: "" });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name || "",
      description: cat.description || "",
    });
    setCategoryImage(cat.image || "");
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

  // Process file from Drop or File Picker
  const processAndUploadFile = async (file) => {
    if (!file) return;
    setUploadingImg(true);
    setFeedback({ type: "", message: "" });

    // Step 1: Try uploading to backend / Cloudinary
    try {
      const formData = new FormData();
      formData.append("images", file);

      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.images && res.data.images.length > 0) {
        setCategoryImage(res.data.images[0]);
        setFeedback({ type: "success", message: "Image uploaded successfully!" });
        setUploadingImg(false);
        return;
      }
    } catch (err) {
      console.warn("Backend cloud upload error, using local optimization fallback:", err);
    }

    // Step 2: Smart Client-Side Compression Fallback (< 200KB)
    try {
      const optimizedDataUrl = await compressImage(file, 1200, 0.82);
      setCategoryImage(optimizedDataUrl);
      setFeedback({ type: "success", message: "Image optimized & attached successfully!" });
    } catch (err) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: "", message: "" });

    if (!form.name.trim()) {
      setFeedback({ type: "error", message: "Category name is required." });
      setSubmitting(false);
      return;
    }

    if (!categoryImage) {
      setFeedback({ type: "error", message: "Please attach a category cover image." });
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        image: categoryImage,
      };

      if (editingCategory) {
        await api.patch(`/categories/${editingCategory._id || editingCategory.id}`, payload);
        setFeedback({ type: "success", message: "Category updated successfully!" });
      } else {
        await api.post("/categories", payload);
        setFeedback({ type: "success", message: "Category created successfully!" });
      }

      await fetchCategories();
      setTimeout(() => {
        setModalOpen(false);
      }, 700);
    } catch (err) {
      const errorMsg =
        err.response?.data?.errors?.join(", ") ||
        err.response?.data?.message ||
        err.message ||
        "Failed to save category.";
      setFeedback({
        type: "error",
        message: errorMsg,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cat) => {
    if (
      !window.confirm(
        `Are you sure you want to delete category "${cat.name}"? Products in this category may become unassigned.`
      )
    )
      return;

    try {
      await api.delete(`/categories/${cat._id || cat.id}`);
      setCategories((prev) =>
        prev.filter((item) => (item._id || item.id) !== (cat._id || cat.id))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete category");
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-skin-terracotta">
            Taxonomy & Navigation
          </span>
          <h1 className="text-2xl md:text-3xl font-serif text-skin-charcoal mt-1">
            Category Management
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-skin-charcoal hover:bg-skin-terracotta text-white rounded-xl text-xs uppercase tracking-wider font-bold transition shadow-md self-start"
        >
          <FiPlus size={16} />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-skin-sand/35 shadow-sm">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3.5 top-3.5 text-skin-charcoal/40" size={15} />
          <input
            type="text"
            placeholder="Search categories by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-skin-cream/20 border border-skin-sand/50 rounded-xl focus:outline-none focus:border-skin-terracotta text-skin-charcoal"
          />
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-skin-charcoal/50 text-xs">
            Loading categories...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="col-span-full py-16 text-center text-skin-charcoal/40 text-xs bg-white rounded-3xl border border-skin-sand/35">
            No categories found matching criteria.
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <div
              key={cat._id || cat.id}
              className="bg-white rounded-3xl border border-skin-sand/35 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Category Image Cover */}
              <div className="w-full h-44 bg-skin-cream/30 relative overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-skin-charcoal/70 via-transparent to-transparent"></div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-lg font-serif font-bold text-white tracking-wide">
                    {cat.name}
                  </h3>
                  <span className="text-[9px] uppercase tracking-widest text-skin-sand/90 font-mono">
                    /category/{cat.slug || cat.name.toLowerCase()}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-skin-charcoal/65 line-clamp-2">
                  {cat.description || "Botanical formulations crafted for targeted skin rituals."}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-skin-sand/30">
                  <Link
                    href={`/category/${encodeURIComponent(cat.name)}`}
                    target="_blank"
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-skin-charcoal/70 hover:text-skin-terracotta transition"
                  >
                    <FiExternalLink size={12} />
                    <span>View Page</span>
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-2 text-skin-charcoal/70 hover:text-skin-charcoal hover:bg-skin-sand/30 rounded-lg transition"
                      title="Edit Category"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Category"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-skin-charcoal/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-skin-sand/40 space-y-6">
            <div className="flex items-center justify-between border-b border-skin-sand/30 pb-4">
              <div>
                <h3 className="text-xl font-serif text-skin-charcoal">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
                <p className="text-[11px] text-skin-charcoal/50 mt-0.5">
                  Define category name, description, and aesthetic cover image
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

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-skin-cream/20 border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:outline-none"
                  placeholder="e.g. Toners & Mists, Eye Creams, Lip Care"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-skin-charcoal/60">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-skin-cream/20 border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:outline-none"
                  placeholder="Formulated solutions designed to address specific concerns and elevate your daily ritual."
                />
              </div>

              {/* Category Cover Image Section */}
              <div className="space-y-3 bg-skin-cream/15 p-4 rounded-2xl border border-skin-sand/40">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-skin-charcoal flex items-center gap-1.5">
                    <FiImage className="text-skin-terracotta" />
                    Cover Banner Image *
                  </span>

                  <button
                    type="button"
                    onClick={() => setGalleryOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-skin-terracotta/15 hover:bg-skin-terracotta/25 text-skin-terracotta rounded-xl text-[11px] font-bold uppercase tracking-wider transition"
                  >
                    <FiGrid size={12} />
                    <span>Choose Preset</span>
                  </button>
                </div>

                {/* Drag & Drop Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 ${
                    isDragging
                      ? "border-skin-terracotta bg-skin-terracotta/10"
                      : "border-skin-sand hover:border-skin-terracotta/60 bg-white"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />

                  {uploadingImg ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-skin-terracotta border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs font-semibold text-skin-charcoal">Processing image...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5">
                      <FiUploadCloud size={22} className="text-skin-terracotta" />
                      <p className="text-xs font-bold text-skin-charcoal">
                        Drag & drop cover photo here, or{" "}
                        <span className="text-skin-terracotta underline">browse file</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Direct Image URL input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FiLink className="absolute left-3 top-2.5 text-skin-charcoal/40" size={13} />
                    <input
                      type="text"
                      placeholder="Or paste an image URL..."
                      value={directUrlInput}
                      onChange={(e) => setDirectUrlInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-skin-sand/60 rounded-xl focus:border-skin-terracotta focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (directUrlInput.trim()) {
                        setCategoryImage(directUrlInput.trim());
                        setDirectUrlInput("");
                      }
                    }}
                    className="px-3 py-1.5 bg-skin-charcoal hover:bg-skin-terracotta text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
                  >
                    Set URL
                  </button>
                </div>

                {/* Preview of selected banner image */}
                {categoryImage && (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-skin-sand/60 shadow-sm mt-2">
                    <img
                      src={categoryImage}
                      alt="Category Preview"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 bg-skin-charcoal/80 text-white text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded">
                      Selected Banner
                    </span>
                  </div>
                )}
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
                  {submitting ? "Saving..." : editingCategory ? "Update Category" : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preset Gallery Modal */}
      {galleryOpen && (
        <div className="fixed inset-0 bg-skin-charcoal/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 max-h-[85vh] overflow-y-auto shadow-2xl border border-skin-sand/40 space-y-6">
            <div className="flex items-center justify-between border-b border-skin-sand/30 pb-4">
              <div>
                <h3 className="text-xl font-serif text-skin-charcoal">
                  Select Category Cover Preset
                </h3>
                <p className="text-xs text-skin-charcoal/50 mt-0.5">
                  Choose a luxury botanical banner for this category
                </p>
              </div>
              <button
                onClick={() => setGalleryOpen(false)}
                className="p-2 text-skin-charcoal/50 hover:text-skin-charcoal rounded-xl"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {CATEGORY_PRESETS.map((preset, idx) => {
                const isSelected = categoryImage === preset.image;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setCategoryImage(preset.image);
                      if (!form.name) {
                        setForm((prev) => ({ ...prev, name: preset.name }));
                      }
                      setGalleryOpen(false);
                    }}
                    className={`group relative rounded-2xl border cursor-pointer overflow-hidden transition-all duration-200 ${
                      isSelected
                        ? "border-skin-terracotta ring-2 ring-skin-terracotta shadow-md"
                        : "border-skin-sand/60 hover:border-skin-charcoal/60"
                    }`}
                  >
                    <div className="w-full h-28 bg-skin-cream/20 overflow-hidden relative">
                      <img
                        src={preset.image}
                        alt={preset.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-skin-terracotta text-white flex items-center justify-center shadow">
                          <FiCheck size={14} />
                        </div>
                      )}
                    </div>
                    <div className="p-2 bg-white">
                      <p className="text-[11px] font-semibold text-skin-charcoal truncate">
                        {preset.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
