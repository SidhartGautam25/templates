"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, MessageSquareQuote } from "lucide-react";
import ReviewFormModal from "./ReviewFormModal";
import {
  useGetReviews,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
  ReviewDataInput,
} from "../hooks/useReviews";

export default function ReviewsList() {
  const { data: reviews = [], isLoading, error } = useGetReviews();
  const createMutation = useCreateReview();
  const updateMutation = useUpdateReview();
  const deleteMutation = useDeleteReview();

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<ReviewDataInput | null>(null);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (data: ReviewDataInput) => {
    setSubmitError("");
    try {
      if (data.id) await updateMutation.mutateAsync(data);
      else await createMutation.mutateAsync(data);
      setModalOpen(false);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Failed to save");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-sm text-text-muted">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-serif text-primary flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5" />
            Reviews
          </h2>
          <p className="text-xs text-text-muted mt-1">Testimonials shown on the homepage.</p>
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
          Add review
        </button>
      </div>

      {error && (
        <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {(error as Error).message}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-2xl text-xs text-text-muted">
          No reviews yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
              <p className="text-sm text-text-main leading-relaxed line-clamp-4">{rev.description}</p>
              <p className="font-bold text-primary mt-3 text-sm">{rev.name}</p>
              {rev.otherInfo && <p className="text-xs text-text-muted">{rev.otherInfo}</p>}
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelected(rev);
                    setModalOpen(true);
                  }}
                  className="text-xs font-bold text-primary flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => rev.id && deleteMutation.mutateAsync(rev.id)}
                  className="text-xs font-bold text-red-600 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ReviewFormModal
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
