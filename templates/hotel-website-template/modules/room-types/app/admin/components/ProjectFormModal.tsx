"use client";

import React, { useState, useEffect } from "react";
import { RoomTypeDataInput } from "../hooks/useProjects";
import { X, Plus, Trash, Upload, Image as ImageIcon } from "lucide-react";
import { SITE } from "@/constants";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RoomTypeDataInput) => void;
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
  const [startingPrice, setStartingPrice] = useState(2000);
  const [size, setSize] = useState("");
  const [view, setView] = useState("");
  const [bedType, setBedType] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [description, setDescription] = useState("");

  // Cover Image handling
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Gallery Images handling
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);

  const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        newFiles.push(files[i]);
      }
      setGalleryFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Categorized Amenities handling
  const [amenitiesPopular, setAmenitiesPopular] = useState<string[]>([]);
  const [newPopular, setNewPopular] = useState("");

  const [amenitiesFeatures, setAmenitiesFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");

  const [amenitiesBasic, setAmenitiesBasic] = useState<string[]>([]);
  const [newBasic, setNewBasic] = useState("");

  const [amenitiesMedia, setAmenitiesMedia] = useState<string[]>([]);
  const [newMedia, setNewMedia] = useState("");

  const [amenitiesBathroom, setAmenitiesBathroom] = useState<string[]>([]);
  const [newBathroom, setNewBathroom] = useState("");

  // Rate Plans handling
  const [ratePlans, setRatePlans] = useState<
    { option: string; details: string[]; price: number; discountedPrice: number; taxesAndFees: number }[]
  >([]);
  const [newPlanOption, setNewPlanOption] = useState("");
  const [newPlanDetailsRaw, setNewPlanDetailsRaw] = useState(""); // Comma separated details
  const [newPlanPrice, setNewPlanPrice] = useState(2500);
  const [newPlanDiscounted, setNewPlanDiscounted] = useState(2100);
  const [newPlanTaxes, setNewPlanTaxes] = useState(252);

  const [validationError, setValidationError] = useState("");

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setStartingPrice(initialData.startingPrice || 2000);
      setSize(initialData.size || "");
      setView(initialData.view || "");
      setBedType(initialData.bedType || "");
      setBathrooms(initialData.bathrooms || "");
      setSortOrder(initialData.sortOrder || 0);
      setDescription(initialData.description || "");
      
      let imgPrev = "";
      let galleryList: string[] = [];
      if (initialData.image) {
        if (initialData.image.startsWith("[")) {
          try {
            const parsed = JSON.parse(initialData.image);
            if (Array.isArray(parsed) && parsed.length > 0) {
              imgPrev = parsed[0];
              galleryList = parsed.slice(1);
            }
          } catch (e) {
            imgPrev = initialData.image;
          }
        } else {
          imgPrev = initialData.image;
        }
      }
      setImagePreview(imgPrev);
      setExistingGallery(galleryList);
      setGalleryFiles([]);
      setImageFile(null);

      // Amenities mapping
      const am = initialData.amenities || {};
      setAmenitiesPopular(am.popular || []);
      setAmenitiesFeatures(am.features || []);
      setAmenitiesBasic(am.basic || []);
      setAmenitiesMedia(am.media || []);
      setAmenitiesBathroom(am.bathroom || []);

      // Rate Plans mapping
      setRatePlans(initialData.ratePlans || []);
    } else {
      // Reset form
      setName("");
      setStartingPrice(2000);
      setSize("");
      setView("");
      setBedType("");
      setBathrooms("");
      setSortOrder(0);
      setDescription("");
      setImagePreview("");
      setImageFile(null);
      setGalleryFiles([]);
      setExistingGallery([]);

      setAmenitiesPopular([]);
      setAmenitiesFeatures([]);
      setAmenitiesBasic([]);
      setAmenitiesMedia([]);
      setAmenitiesBathroom([]);
      setRatePlans([]);
    }
    setValidationError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

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

  const handleAddPopular = () => {
    if (newPopular.trim()) {
      setAmenitiesPopular((prev) => [...prev, newPopular.trim()]);
      setNewPopular("");
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setAmenitiesFeatures((prev) => [...prev, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const handleAddBasic = () => {
    if (newBasic.trim()) {
      setAmenitiesBasic((prev) => [...prev, newBasic.trim()]);
      setNewBasic("");
    }
  };

  const handleAddMedia = () => {
    if (newMedia.trim()) {
      setAmenitiesMedia((prev) => [...prev, newMedia.trim()]);
      setNewMedia("");
    }
  };

  const handleAddBathroom = () => {
    if (newBathroom.trim()) {
      setAmenitiesBathroom((prev) => [...prev, newBathroom.trim()]);
      setNewBathroom("");
    }
  };

  const handleAddRatePlan = () => {
    if (!newPlanOption.trim()) return setValidationError("Rate plan option title is required.");
    
    const details = newPlanDetailsRaw
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    setRatePlans((prev) => [
      ...prev,
      {
        option: newPlanOption.trim(),
        details,
        price: newPlanPrice,
        discountedPrice: newPlanDiscounted,
        taxesAndFees: newPlanTaxes,
      },
    ]);

    setNewPlanOption("");
    setNewPlanDetailsRaw("");
    setNewPlanPrice(2500);
    setNewPlanDiscounted(2100);
    setNewPlanTaxes(252);
    setValidationError("");
  };

  const handleRemoveRatePlan = (index: number) => {
    setRatePlans((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Required fields check
    if (!name.trim()) return setValidationError("Room Name is required.");
    if (!size.trim()) return setValidationError("Room Size is required.");
    if (!view.trim()) return setValidationError("Room View details are required.");
    if (!bedType.trim()) return setValidationError("Bed Config is required.");
    if (!bathrooms.trim()) return setValidationError("Bathroom count details are required.");
    if (!imagePreview) return setValidationError("An image is required (upload a file).");

    const submissionData: RoomTypeDataInput = {
      id: initialData?.id,
      name,
      startingPrice,
      size,
      view,
      bedType,
      bathrooms,
      image: imageFile,
      gallery: galleryFiles,
      existingGallery,
      description,
      amenities: {
        popular: amenitiesPopular,
        features: amenitiesFeatures,
        basic: amenitiesBasic,
        media: amenitiesMedia,
        bathroom: amenitiesBathroom,
      },
      ratePlans,
      sortOrder,
    };

    onSubmit(submissionData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black/[0.05] flex items-center justify-between bg-bg-tan/20">
          <h3 className="text-lg font-bold font-serif text-primary">
            {initialData ? "Edit Room Type" : "Add Room Type"}
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
            {/* Room Name */}
            <div className="col-span-full">
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
                Room Type Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Twin Deluxe With Bathtub"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
                Starting Price (₹) *
              </label>
              <input
                type="number"
                value={startingPrice}
                onChange={(e) => setStartingPrice(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
              />
            </div>

            {/* Room Size */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
                Room Size *
              </label>
              <input
                type="text"
                placeholder="e.g. 140 sq.ft (13 sq.mt)"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
              />
            </div>

            {/* View */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
                View *
              </label>
              <input
                type="text"
                placeholder="e.g. City View"
                value={view}
                onChange={(e) => setView(e.target.value)}
                className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
              />
            </div>

            {/* Bed Config */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
                Bed Config *
              </label>
              <input
                type="text"
                placeholder="e.g. 1 Queen Bed"
                value={bedType}
                onChange={(e) => setBedType(e.target.value)}
                className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
              />
            </div>

            {/* Bathroom */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
                Bathroom Config *
              </label>
              <input
                type="text"
                placeholder="e.g. 1 Bathroom"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
              />
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

            {/* Room Description */}
            <div className="col-span-full">
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
                Description (Optional)
              </label>
              <textarea
                placeholder="Enter a description of this room layout and comfort features..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold resize-none"
              />
            </div>

            {/* Cover Image File Selector */}
            <div className="col-span-full border-t border-black/[0.05] pt-4 mt-2">
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-2">
                Room Cover Image *
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

            {/* Gallery Images File Selector */}
            <div className="col-span-full border-t border-black/[0.05] pt-4 mt-2">
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-2">
                Room Gallery Images (Optional)
              </label>
              
              {/* Existing Gallery Images Previews */}
              {existingGallery.length > 0 && (
                <div className="mb-4 col-span-full">
                  <span className="block text-[9px] font-bold text-text-muted mb-1.5 font-sans">Existing Gallery Images:</span>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {existingGallery.map((imgUrl, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl border border-black/[0.06] bg-bg-tan overflow-hidden group/item">
                        <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setExistingGallery((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                          title="Remove image"
                        >
                          <Trash className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Newly Selected Gallery Files */}
              {galleryFiles.length > 0 && (
                <div className="mb-4 col-span-full">
                  <span className="block text-[9px] font-bold text-text-muted mb-1.5 font-sans">New Gallery Images to upload:</span>
                  <div className="flex flex-wrap gap-2">
                    {galleryFiles.map((file, idx) => (
                      <span key={idx} className="bg-bg-tan/40 border border-black/[0.06] pl-2.5 pr-1 py-1 rounded-xl text-[10px] flex items-center gap-1.5 font-medium">
                        <span className="truncate max-w-[120px]">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => setGalleryFiles((prev) => prev.filter((_, i) => i !== idx))}
                          className="p-1 hover:bg-black/5 rounded-full text-red-500 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Multi-upload Button */}
              <div className="flex items-center gap-4">
                <div className="flex-1 w-full">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-black/[0.12] hover:border-accent-gold rounded-2xl p-4 cursor-pointer text-center group transition-colors">
                    <Upload className="w-6 h-6 text-text-muted group-hover:text-accent-gold-dark transition-colors mb-1.5" />
                    <span className="text-xs font-bold text-primary group-hover:text-accent-gold-dark">
                      Click to add multiple gallery images
                    </span>
                    <span className="text-[9px] text-text-muted mt-1 block">
                      Select one or more files
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryFilesChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Amenities Section */}
            <div className="col-span-full border-t border-black/[0.05] pt-4 mt-2 space-y-4">
              <span className="block text-[10px] uppercase tracking-wider text-text-muted font-bold">
                Categorized Amenities
              </span>

              {/* Popular builder */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold text-text-muted">Popular with Guests</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Free Wi-Fi"
                    value={newPopular}
                    onChange={(e) => setNewPopular(e.target.value)}
                    className="flex-1 bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddPopular}
                    className="bg-primary text-white p-2 rounded-xl"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {amenitiesPopular.map((am, i) => (
                    <span key={i} className="bg-bg-tan/40 border px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 font-medium">
                      {am} <X className="w-3 h-3 text-red-500 cursor-pointer" onClick={() => setAmenitiesPopular(prev => prev.filter((_, idx) => idx !== i))} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Features builder */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold text-text-muted">Room Features</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Electric Kettle"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="bg-primary text-white p-2 rounded-xl"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {amenitiesFeatures.map((am, i) => (
                    <span key={i} className="bg-bg-tan/40 border px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 font-medium">
                      {am} <X className="w-3 h-3 text-red-500 cursor-pointer" onClick={() => setAmenitiesFeatures(prev => prev.filter((_, idx) => idx !== i))} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Basic builder */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold text-text-muted">Basic Facilities</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Air Conditioning"
                    value={newBasic}
                    onChange={(e) => setNewBasic(e.target.value)}
                    className="flex-1 bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddBasic}
                    className="bg-primary text-white p-2 rounded-xl"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {amenitiesBasic.map((am, i) => (
                    <span key={i} className="bg-bg-tan/40 border px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 font-medium">
                      {am} <X className="w-3 h-3 text-red-500 cursor-pointer" onClick={() => setAmenitiesBasic(prev => prev.filter((_, idx) => idx !== i))} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Media builder */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold text-text-muted">Media & Entertainment</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 32-inch Flat screen TV"
                    value={newMedia}
                    onChange={(e) => setNewMedia(e.target.value)}
                    className="flex-1 bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddMedia}
                    className="bg-primary text-white p-2 rounded-xl"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {amenitiesMedia.map((am, i) => (
                    <span key={i} className="bg-bg-tan/40 border px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 font-medium">
                      {am} <X className="w-3 h-3 text-red-500 cursor-pointer" onClick={() => setAmenitiesMedia(prev => prev.filter((_, idx) => idx !== i))} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Bathroom builder */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold text-text-muted">Bathroom Amenities</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Free Toiletries"
                    value={newBathroom}
                    onChange={(e) => setNewBathroom(e.target.value)}
                    className="flex-1 bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddBathroom}
                    className="bg-primary text-white p-2 rounded-xl"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {amenitiesBathroom.map((am, i) => (
                    <span key={i} className="bg-bg-tan/40 border px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 font-medium">
                      {am} <X className="w-3 h-3 text-red-500 cursor-pointer" onClick={() => setAmenitiesBathroom(prev => prev.filter((_, idx) => idx !== i))} />
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Rate Plans Section */}
            <div className="col-span-full border-t border-black/[0.05] pt-4 mt-2 space-y-4">
              <span className="block text-[10px] uppercase tracking-wider text-text-muted font-bold">
                Stay Rate Plans (Optional)
              </span>

              {/* Add plan layout form */}
              <div className="bg-bg-tan/20 border border-black/[0.06] rounded-2xl p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-text-muted mb-1">Plan Option Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Room Only / Free Cancellation"
                      value={newPlanOption}
                      onChange={(e) => setNewPlanOption(e.target.value)}
                      className="w-full bg-white border rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-muted mb-1">Inclusions / Details (comma separated)</label>
                    <input
                      type="text"
                      placeholder="Free Wifi, Non-Refundable, Welcome drink"
                      value={newPlanDetailsRaw}
                      onChange={(e) => setNewPlanDetailsRaw(e.target.value)}
                      className="w-full bg-white border rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[9px] font-bold text-text-muted mb-1">Base Price (₹)</label>
                    <input
                      type="number"
                      value={newPlanPrice}
                      onChange={(e) => setNewPlanPrice(parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-white border rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-muted mb-1">Discounted (₹)</label>
                    <input
                      type="number"
                      value={newPlanDiscounted}
                      onChange={(e) => setNewPlanDiscounted(parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-white border rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-muted mb-1">Taxes & Fees (₹)</label>
                    <input
                      type="number"
                      value={newPlanTaxes}
                      onChange={(e) => setNewPlanTaxes(parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-white border rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleAddRatePlan}
                    className="bg-primary text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Rate Plan
                  </button>
                </div>
              </div>

              {/* Rate plans list */}
              <div className="space-y-2">
                {ratePlans.map((plan, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-bg-tan/20 border border-black/[0.04] rounded-xl text-xs">
                    <div>
                      <span className="font-bold text-primary block">{plan.option}</span>
                      <span className="text-[10px] text-accent-gold-dark font-semibold">₹{plan.discountedPrice} / night (Discounted from ₹{plan.price}) + ₹{plan.taxesAndFees} Taxes</span>
                      <span className="text-[10px] text-text-muted block mt-0.5">Details: {plan.details.join(", ")}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveRatePlan(index)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 cursor-pointer"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="border-t border-black/[0.05] pt-4 mt-6 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 border border-black/[0.12] hover:bg-black/5 text-xs font-bold text-text-muted rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting ? "Saving stay..." : "Save Room Type"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
