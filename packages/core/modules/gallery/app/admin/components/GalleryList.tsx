"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Images } from "lucide-react";
import GalleryFormModal from "./GalleryFormModal";
import {
  useGetGallery,
  useCreateGalleryImage,
  useUpdateGalleryImage,
  useDeleteGalleryImage,
  GalleryDataInput,
} from "../hooks/useGallery";

export default function GalleryList() {
  const { data: items = [], isLoading, error } = useGetGallery();
  const createMutation = useCreateGalleryImage();
  const updateMutation = useUpdateGalleryImage();
  const deleteMutation = useDeleteGalleryImage();

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<GalleryDataInput | null>(null);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (data: GalleryDataInput) => {
    setSubmitError("");
    try {
      if (data.id) await updateMutation.mutateAsync(data);
      else await createMutation.mutateAsync(data);
      setModalOpen(false);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Failed to save");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this gallery image?")) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-sm text-text-muted">Loading gallery...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-serif text-primary flex items-center gap-2">
            <Images className="w-5 h-5" />
            Gallery
          </h2>
          <p className="text-xs text-text-muted mt-1">Manage images for the gallery page and homepage section.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelected(null);
            setSubmitError("");
            setModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add image
        </button>
      </div>

      {error && (
        <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {(error as Error).message}
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-2xl text-xs text-text-muted">
          No gallery images yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-primary/10 bg-white overflow-hidden shadow-sm"
            >
              <div className="relative aspect-video bg-bg-light">
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-bold text-sm text-primary">{item.title}</p>
                    <p className="text-[10px] uppercase tracking-wider text-text-muted">{item.category}</p>
                  </div>
                  {!item.published && (
                    <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(item);
                      setModalOpen(true);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-primary cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => item.id && handleDelete(item.id)}
                    className="flex items-center gap-1 text-xs font-bold text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <GalleryFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selected}
        error={submitError}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
