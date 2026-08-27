"use client";

import React, { useEffect, useState } from "react";
import type { ReviewDataInput } from "../hooks/useReviews";

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReviewDataInput) => void;
  initialData: ReviewDataInput | null;
  error?: string;
  isSubmitting?: boolean;
}

export default function ReviewFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  error,
  isSubmitting,
}: ReviewFormModalProps) {
  const [form, setForm] = useState<ReviewDataInput>({
    name: "",
    otherInfo: "",
    description: "",
    sortOrder: 0,
  });

  useEffect(() => {
    if (isOpen) {
      setForm(
        initialData ?? {
          name: "",
          otherInfo: "",
          description: "",
          sortOrder: 0,
        }
      );
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-primary/10"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-primary mb-4">
          {initialData?.id ? "Edit review" : "Add review"}
        </h3>

        {error && (
          <div className="mb-4 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">{error}</div>
        )}

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
        >
          <input
            className="w-full border border-primary/20 rounded-lg px-3 py-2 text-sm"
            placeholder="Name*"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="w-full border border-primary/20 rounded-lg px-3 py-2 text-sm"
            placeholder="Role / location (optional)"
            value={form.otherInfo ?? ""}
            onChange={(e) => setForm({ ...form, otherInfo: e.target.value })}
          />
          <textarea
            className="w-full border border-primary/20 rounded-lg px-3 py-2 text-sm resize-none"
            placeholder="Review text*"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <input
            type="number"
            className="w-full border border-primary/20 rounded-lg px-3 py-2 text-sm"
            placeholder="Sort order"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })}
          />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border text-sm font-bold cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-bold disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
