"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ReviewDataInput } from "../hooks/useReviews";

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReviewDataInput) => void;
  initialData?: any;
  error?: string;
}

export default function ReviewFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  error,
}: ReviewFormModalProps) {
  const [name, setName] = useState("");
  const [otherInfo, setOtherInfo] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setOtherInfo(initialData.otherInfo || "");
      setDescription(initialData.description || "");
      setSortOrder(initialData.sortOrder || 0);
    } else {
      setName("");
      setOtherInfo("");
      setDescription("");
      setSortOrder(0);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!name.trim()) return setValidationError("Reviewer Name is required.");
    if (!description.trim()) return setValidationError("Review Description is required.");

    onSubmit({
      id: initialData?.id,
      name,
      otherInfo: otherInfo.trim() || null,
      description,
      sortOrder,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black/[0.05] flex items-center justify-between bg-bg-tan/20">
          <h3 className="text-base font-bold font-serif text-primary">
            {initialData ? "Edit Review" : "Add Guest Review"}
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

          {/* Name */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
              Guest Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Aman Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
            />
          </div>

          {/* Other Info */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">
              Other Info (e.g. Address/City, or leave empty)
            </label>
            <input
              type="text"
              placeholder="e.g. Patna, Bihar"
              value={otherInfo}
              onChange={(e) => setOtherInfo(e.target.value)}
              className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
            />
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
              Review description *
            </label>
            <textarea
              placeholder="Write the review copy here..."
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
              {initialData ? "Save Changes" : "Add Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
