"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { FacilityDataInput } from "../hooks/useFacilities";

interface FacilityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FacilityDataInput) => void;
  initialData?: any;
  error?: string;
}

const AVAILABLE_ICONS = [
  { value: "bell", label: "Concierge / Bell" },
  { value: "wifi", label: "Wi-Fi" },
  { value: "wind", label: "Air Conditioning (Wind)" },
  { value: "refresh-cw", label: "Washing Machine / Refresh" },
  { value: "car", label: "Parking Space (Car)" },
  { value: "utensils", label: "Room Service (Utensils)" },
  { value: "zap", label: "Power Backup (Zap)" },
  { value: "sparkles", label: "Housekeeping (Sparkles)" },
  { value: "tv", label: "Television (TV)" },
  { value: "bath", label: "Bathtub / Bath" },
  { value: "shield", label: "Security (Shield)" },
  { value: "key", label: "Smart Key / Access" },
];

export default function FacilityFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  error,
}: FacilityFormModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("wifi");
  const [sortOrder, setSortOrder] = useState(0);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setIcon(initialData.icon || "wifi");
      setSortOrder(initialData.sortOrder || 0);
    } else {
      setTitle("");
      setDescription("");
      setIcon("wifi");
      setSortOrder(0);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!title.trim()) return setValidationError("Facility Title is required.");
    if (!description.trim()) return setValidationError("Facility Description is required.");
    if (!icon.trim()) return setValidationError("Please choose an icon.");

    onSubmit({
      id: initialData?.id,
      title,
      description,
      icon,
      sortOrder,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black/[0.05] flex items-center justify-between bg-bg-tan/20">
          <h3 className="text-base font-bold font-serif text-primary">
            {initialData ? "Edit Facility" : "Add New Facility"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/5 text-text-muted hover:text-primary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
          {(validationError || error) && (
            <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl space-y-1">
              {validationError && <div>{validationError}</div>}
              {error && <div>{error}</div>}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
              Facility Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Reception Support"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
              Choose Icon *
            </label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold cursor-pointer"
            >
              {AVAILABLE_ICONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
              Sort Order Priority (Higher comes first)
            </label>
            <input
              type="number"
              placeholder="e.g. 10"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
              Facility Description *
            </label>
            <textarea
              placeholder="Provide a detailed description of this facility..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-black/[0.05] mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-text-muted hover:text-primary transition-colors border border-black/[0.08] rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md transition-all cursor-pointer hover:scale-[1.02]"
            >
              {initialData ? "Save Changes" : "Add Facility"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
