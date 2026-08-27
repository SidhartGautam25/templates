"use client";

import React, { useState, useEffect } from "react";
import { ProjectDataInput } from "../hooks/useProjects";
import { X, Plus, Trash, Upload, Image as ImageIcon } from "lucide-react";
import { SITE } from "@/constants";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectDataInput) => void;
  initialData?: any | null;
  isSubmitting: boolean;
  error?: string | null;
}

export default function ProjectFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting,
  error = null,
}: ProjectFormModalProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [typology, setTypology] = useState("");
  const [price, setPrice] = useState("");
  const [possession, setPossession] = useState("");
  const [tag1, setTag1] = useState("");
  const [tag2, setTag2] = useState("");
  const [rera, setRera] = useState("");
  const [reraId, setReraId] = useState("");
  const [reraLabel, setReraLabel] = useState("");
  const [reraQrImageFile, setReraQrImageFile] = useState<File | null>(null);
  const [reraQrImagePreview, setReraQrImagePreview] = useState("");
  const [category, setCategory] = useState<"apartments" | "plots">("apartments");
  const [isNewLaunch, setIsNewLaunch] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  
  // Highlights handling
  const [highlights, setHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState("");

  // Cover Image handling
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Description
  const [description, setDescription] = useState("");

  // Amenities handling
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState("");

  // Gallery Handling
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // Floor Plans Handling
  const [floorPlans, setFloorPlans] = useState<{ title: string; size: string; image?: string; file?: File | null }[]>([]);
  const [newFpTitle, setNewFpTitle] = useState("");
  const [newFpSize, setNewFpSize] = useState("");
  const [newFpFile, setNewFpFile] = useState<File | null>(null);
  const [newFpPreview, setNewFpPreview] = useState("");

  const [validationError, setValidationError] = useState("");

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setLocation(initialData.location || "");
      setTypology(initialData.typology || "");
      setPrice(initialData.price || "");
      setPossession(initialData.possession || "");
      setTag1(initialData.tag1 || "");
      setTag2(initialData.tag2 || "");
      setRera(initialData.rera || "");
      setReraId(initialData.reraId || "");
      setReraLabel(initialData.reraLabel || "");
      setReraQrImagePreview(initialData.reraQrImage || "");
      setReraQrImageFile(null);
      setCategory(initialData.category || "apartments");
      setIsNewLaunch(initialData.isNewLaunch || false);
      setSortOrder(initialData.sortOrder || 0);
      setHighlights(initialData.highlights || []);
      setImagePreview(initialData.image || "");
      setImageFile(null);

      setDescription(initialData.description || "");
      setAmenities(initialData.amenities || []);
      setGalleryUrls(initialData.gallery || []);
      setGalleryFiles([]);
      setGalleryPreviews([]);
      setFloorPlans(initialData.floorPlans || []);
    } else {
      // Reset form
      setName("");
      setLocation("");
      setTypology("");
      setPrice("");
      setPossession("");
      setTag1("");
      setTag2("");
      setRera("");
      setReraId("");
      setReraLabel("");
      setReraQrImagePreview("");
      setReraQrImageFile(null);
      setCategory("apartments");
      setIsNewLaunch(false);
      setSortOrder(0);
      setHighlights([]);
      setImagePreview("");
      setImageFile(null);

      setDescription("");
      setAmenities([]);
      setGalleryUrls([]);
      setGalleryFiles([]);
      setGalleryPreviews([]);
      setFloorPlans([]);
    }
    setValidationError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setHighlights((prev) => [...prev, newHighlight.trim()]);
      setNewHighlight("");
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setAmenities((prev) => [...prev, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setAmenities((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Gallery Handling
  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      setGalleryFiles((prev) => [...prev, ...filesArray]);
      
      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setGalleryPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveExistingGallery = (urlToRemove: string) => {
    setGalleryUrls((prev) => prev.filter((url) => url !== urlToRemove));
  };

  const handleRemoveNewGallery = (indexToRemove: number) => {
    setGalleryFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setGalleryPreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Floor Plans Handling
  const handleFpLayoutFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFpFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewFpPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddFloorPlan = () => {
    if (!newFpTitle.trim()) return setValidationError("Floor Plan Title is required to add.");
    if (!newFpSize.trim()) return setValidationError("Floor Plan Size is required to add.");
    if (!newFpPreview) return setValidationError("Floor Plan Image is required to add.");

    setFloorPlans((prev) => [
      ...prev,
      {
        title: newFpTitle.trim(),
        size: newFpSize.trim(),
        file: newFpFile,
        image: newFpPreview,
      },
    ]);

    setNewFpTitle("");
    setNewFpSize("");
    setNewFpFile(null);
    setNewFpPreview("");
    setValidationError("");
  };

  const handleRemoveFloorPlan = (index: number) => {
    setFloorPlans((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Required fields check
    if (!name.trim()) return setValidationError("Project Name is required.");
    if (!location.trim()) return setValidationError("Location is required.");
    if (!typology.trim()) return setValidationError("Typology is required.");
    if (!price.trim()) return setValidationError("Price is required.");
    if (!rera.trim()) return setValidationError("RERA ID is required.");
    if (!imagePreview) return setValidationError("An image is required (upload a file).");

    const submissionData: ProjectDataInput = {
      id: initialData?.id,
      name,
      location,
      typology,
      price,
      possession,
      tag1,
      tag2,
      rera,
      reraId,
      reraLabel,
      reraQrImage: reraQrImageFile,
      category,
      highlights,
      image: imageFile,
      description,
      amenities,
      galleryUrls,
      galleryFiles,
      floorPlans,
      isNewLaunch,
      sortOrder,
    };

    onSubmit(submissionData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black/[0.05] flex items-center justify-between bg-bg-tan/20">
          <h3 className="text-lg font-bold font-serif text-primary">
            {initialData ? SITE.admin.projectForm.editTitle : SITE.admin.projectForm.addTitle}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/5 text-text-muted hover:text-primary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto p-6 space-y-6">
          {(validationError || error) && (
            <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl space-y-1">
              {validationError && <div>{validationError}</div>}
              {error && <div>{error}</div>}
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Project Name */}
            <div className="col-span-full">
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
                Project Name *
              </label>
              <input
                type="text"
                placeholder={SITE.admin.projectForm.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
                Location *
              </label>
              <input
                type="text"
                placeholder="e.g. At Park World, Hinjawadi"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold appearance-none cursor-pointer"
              >
                <option value="apartments">{SITE.projectGrid.tabs.apartments}</option>
                <option value="plots">{SITE.projectGrid.tabs.plots}</option>
              </select>
            </div>

            {/* Typology */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
                Typology *
              </label>
              <input
                type="text"
                placeholder="e.g. 2 & 3 BHK Apartments"
                value={typology}
                onChange={(e) => setTypology(e.target.value)}
                className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
                Price *
              </label>
              <input
                type="text"
                placeholder="e.g. ₹ 1.15 Cr* Onwards"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
              />
            </div>

            {/* RERA ID */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
                RERA Code / Registration Number *
              </label>
              <input
                type="text"
                placeholder="e.g. P52100079064"
                value={rera}
                onChange={(e) => setRera(e.target.value)}
                className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
              />
            </div>

            {/* RERA Label */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
                RERA Label (Optional)
              </label>
              <input
                type="text"
                placeholder={SITE.admin.projectForm.reraPlaceholder}
                value={reraLabel}
                onChange={(e) => setReraLabel(e.target.value)}
                className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
              />
            </div>

            {/* RERA Detailed ID */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
                RERA Detailed ID (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. P52100079064"
                value={reraId}
                onChange={(e) => setReraId(e.target.value)}
                className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
              />
            </div>

            {/* RERA QR Image */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
                RERA QR Scanner Image (Optional)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setReraQrImageFile(file);
                    if (file) {
                      setReraQrImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="text-xs text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white file:cursor-pointer hover:file:opacity-90"
                />
                {reraQrImagePreview && (
                  <div className="relative w-16 h-16 border border-black/[0.08] rounded-xl overflow-hidden bg-white flex items-center justify-center p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={reraQrImagePreview} alt="RERA QR Preview" className="max-w-full max-h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => {
                        setReraQrImageFile(null);
                        setReraQrImagePreview("");
                      }}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-0.5"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Possession Year */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
                Possession Year (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 2029"
                value={possession}
                onChange={(e) => setPossession(e.target.value)}
                className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
              />
            </div>

            {/* Tag 1 */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
                Badge Tag 1 (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 20:20:60 Payment Plan"
                value={tag1}
                onChange={(e) => setTag1(e.target.value)}
                className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
              />
            </div>

            {/* Tag 2 */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
                Badge Tag 2 (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Zero EMI for 36 Months"
                value={tag2}
                onChange={(e) => setTag2(e.target.value)}
                className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
              />
            </div>

            {/* New Launch Status Toggle */}
            <div className="flex items-center space-x-3 pt-4 sm:pt-6">
              <input
                type="checkbox"
                id="isNewLaunch"
                checked={isNewLaunch}
                onChange={(e) => setIsNewLaunch(e.target.checked)}
                className="w-4 h-4 text-primary focus:ring-accent-gold border-black/[0.12] rounded cursor-pointer"
              />
              <label htmlFor="isNewLaunch" className="text-xs font-bold text-primary cursor-pointer select-none">
                Mark as "New Launch" (Gold Badge)
              </label>
            </div>

            {/* Display Order Priority */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
                Display Order Priority (Higher comes first)
              </label>
              <input
                type="number"
                placeholder="e.g. 10"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
              />
            </div>

            {/* Project Description */}
            <div className="col-span-full">
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
                Description (Optional)
              </label>
              <textarea
                placeholder="Describe the project overview details, architecture, builder amenities, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold resize-none"
              />
            </div>

            {/* Image File Selector */}
            <div className="col-span-full border-t border-black/[0.05] pt-4 mt-2">
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-2">
                Project Cover Image *
              </label>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Preview Thumbnail */}
                <div className="relative w-28 h-28 rounded-2xl bg-bg-tan border border-black/[0.06] overflow-hidden flex items-center justify-center flex-shrink-0">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-text-muted" />
                  )}
                </div>

                {/* Upload Action Area */}
                <div className="flex-1 w-full">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-black/[0.12] hover:border-accent-gold rounded-2xl p-4 cursor-pointer text-center group transition-colors">
                    <Upload className="w-6 h-6 text-text-muted group-hover:text-accent-gold-dark transition-colors mb-1.5" />
                    <span className="text-xs font-bold text-primary group-hover:text-accent-gold-dark">
                      Click to upload cover image file
                    </span>
                    <span className="text-[9px] text-text-muted mt-1 block">
                      PNG, JPG, JPEG formats
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Gallery Upload Section */}
            <div className="col-span-full border-t border-black/[0.05] pt-4 mt-2">
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-2">
                Project Gallery Images (Optional)
              </label>

              <div className="space-y-4">
                {/* Multi-upload Trigger */}
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-black/[0.12] hover:border-accent-gold rounded-2xl p-4 cursor-pointer text-center group transition-colors">
                  <Upload className="w-6 h-6 text-text-muted group-hover:text-accent-gold-dark transition-colors mb-1.5" />
                  <span className="text-xs font-bold text-primary group-hover:text-accent-gold-dark">
                    Click to add gallery images (Multiple)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryFileChange}
                    className="hidden"
                  />
                </label>

                {/* Gallery Preview Grid */}
                <div className="grid grid-cols-4 gap-2">
                  {/* Existing Gallery Images */}
                  {galleryUrls.map((url, idx) => (
                    <div key={`existing-${idx}`} className="relative aspect-square rounded-xl bg-bg-tan overflow-hidden border border-black/[0.06] group">
                      <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingGallery(url)}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white rounded-xl cursor-pointer"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  ))}

                  {/* Newly Added Gallery Images */}
                  {galleryPreviews.map((preview, idx) => (
                    <div key={`new-${idx}`} className="relative aspect-square rounded-xl bg-bg-tan overflow-hidden border border-black/[0.06] group">
                      <img src={preview} alt="Gallery Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewGallery(idx)}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white rounded-xl cursor-pointer"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Highlights Lists Input */}
            <div className="col-span-full border-t border-black/[0.05] pt-4 mt-2">
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
                Project Key Highlights
              </label>
              
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g. Pay only 1% Every Month"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddHighlight();
                    }
                  }}
                  className="flex-1 bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
                />
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="bg-primary hover:bg-primary/95 text-white p-2.5 rounded-xl cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Highlights item list */}
              <div className="flex flex-wrap gap-2">
                {highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-bg-tan/20 border border-black/[0.04] rounded-full px-3 py-1 text-xs text-primary"
                  >
                    <span>{highlight}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(index)}
                      className="text-red-500 hover:text-red-700 p-0.5 rounded-full hover:bg-red-50 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {highlights.length === 0 && (
                  <span className="text-[11px] text-text-muted italic block py-2">
                    No highlights added yet.
                  </span>
                )}
              </div>
            </div>

            {/* Amenities Section */}
            <div className="col-span-full border-t border-black/[0.05] pt-4 mt-2">
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
                Amenities (Optional)
              </label>

              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g. Swimming Pool"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddAmenity();
                    }
                  }}
                  className="flex-1 bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
                />
                <button
                  type="button"
                  onClick={handleAddAmenity}
                  className="bg-primary hover:bg-primary/95 text-white p-2.5 rounded-xl cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-bg-tan/20 border border-black/[0.04] rounded-full px-3 py-1 text-xs text-primary"
                  >
                    <span>{amenity}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(index)}
                      className="text-red-500 hover:text-red-700 p-0.5 rounded-full hover:bg-red-50 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {amenities.length === 0 && (
                  <span className="text-[11px] text-text-muted italic block py-2">
                    No amenities added yet.
                  </span>
                )}
              </div>
            </div>

            {/* Floor Plans Builder Section */}
            <div className="col-span-full border-t border-black/[0.05] pt-4 mt-2">
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-3">
                Project Floor Plans (Optional)
              </label>

              {/* Add floor plan form */}
              <div className="bg-bg-tan/20 border border-black/[0.06] rounded-2xl p-4 space-y-3 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">
                      Plan Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2 BHK Premium"
                      value={newFpTitle}
                      onChange={(e) => setNewFpTitle(e.target.value)}
                      className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">
                      Carpet Area / Size
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 850 Sq.Ft."
                      value={newFpSize}
                      onChange={(e) => setNewFpSize(e.target.value)}
                      className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <div className="relative w-20 h-20 rounded-xl bg-white border border-black/[0.06] overflow-hidden flex items-center justify-center flex-shrink-0">
                    {newFpPreview ? (
                      <img src={newFpPreview} alt="Floor Plan Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-text-muted" />
                    )}
                  </div>
                  <div className="flex-1 w-full flex items-center gap-2">
                    <label className="flex-1 flex items-center justify-center border border-dashed border-black/[0.12] hover:border-accent-gold rounded-xl py-2 cursor-pointer text-center transition-colors">
                      <span className="text-xs font-bold text-primary">
                        {newFpFile ? newFpFile.name : "Upload Plan Image"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFpLayoutFileChange}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleAddFloorPlan}
                      className="bg-primary hover:bg-primary/95 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Floor plans list */}
              <div className="space-y-2">
                {floorPlans.map((fp, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white border border-black/[0.06] rounded-xl p-3"
                  >
                    <div className="flex items-center gap-3">
                      <img src={fp.image} alt={fp.title} className="w-10 h-10 object-cover rounded-lg border border-black/[0.04]" />
                      <div>
                        <h4 className="text-xs font-bold text-primary">{fp.title}</h4>
                        <span className="text-[10px] text-text-muted">{fp.size}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFloorPlan(index)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 cursor-pointer"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {floorPlans.length === 0 && (
                  <span className="text-[11px] text-text-muted italic block py-1">
                    No floor plans added yet.
                  </span>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Footer controls */}
        <div className="px-6 py-4 border-t border-black/[0.05] flex items-center justify-end gap-3 bg-bg-tan/20">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-text-muted hover:text-primary hover:bg-black/5 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmitForm}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-primary hover:bg-primary/95 text-white font-bold px-6 py-2.5 rounded-xl text-xs tracking-wider transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "SAVING..." : "SAVE PROJECT"}
          </button>
        </div>
      </div>
    </div>
  );
}
