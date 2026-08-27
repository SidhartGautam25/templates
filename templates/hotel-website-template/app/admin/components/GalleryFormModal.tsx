"use client";

import React, { useEffect, useState } from "react";
import type { GalleryDataInput } from "../hooks/useGallery";

interface GalleryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GalleryDataInput) => void;
  initialData: GalleryDataInput | null;
  error?: string;
  isSubmitting?: boolean;
}

export default function GalleryFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  error,
  isSubmitting,
}: GalleryFormModalProps) {
  const [form, setForm] = useState<GalleryDataInput>({
    title: "",
    category: "general",
    description: "",
    imageUrl: "",
    sortOrder: 0,
    published: true,
  });

  useEffect(() => {
    if (isOpen) {
      setForm(
        initialData ?? {
          title: "",
          category: "general",
          description: "",
          imageUrl: "",
          sortOrder: 0,
          published: true,
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
          {initialData?.id ? "Edit image" : "Add gallery image"}
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
            placeholder="Title*"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            className="w-full border border-primary/20 rounded-lg px-3 py-2 text-sm"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            className="w-full border border-primary/20 rounded-lg px-3 py-2 text-sm"
            placeholder="Image URL* (/assets/... or https://)"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            required
          />
          <textarea
            className="w-full border border-primary/20 rounded-lg px-3 py-2 text-sm resize-none"
            placeholder="Description (optional)"
            rows={2}
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="number"
            className="w-full border border-primary/20 rounded-lg px-3 py-2 text-sm"
            placeholder="Sort order"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Published on site
          </label>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-primary/20 text-sm font-bold cursor-pointer"
            >
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
