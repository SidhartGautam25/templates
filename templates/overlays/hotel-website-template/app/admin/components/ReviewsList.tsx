"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Quote, Star } from "lucide-react";
import {
  useGetReviews,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
  ReviewDataInput,
} from "../hooks/useReviews";
import ReviewFormModal from "./ReviewFormModal";

export default function ReviewsList() {
  const { data: reviews = [], isLoading, error: fetchError } = useGetReviews();
  const createMutation = useCreateReview();
  const updateMutation = useUpdateReview();
  const deleteMutation = useDeleteReview();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [submitError, setSubmitError] = useState("");

  const handleOpenAdd = () => {
    setSelectedReview(null);
    setSubmitError("");
    setModalOpen(true);
  };

  const handleOpenEdit = (review: any) => {
    setSelectedReview(review);
    setSubmitError("");
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this guest review?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err: any) {
        alert(err.message || "Failed to delete review");
      }
    }
  };

  const handleFormSubmit = async (data: ReviewDataInput) => {
    setSubmitError("");
    try {
      if (data.id) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
      setModalOpen(false);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to save review details.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-text-muted">
        Loading guest reviews...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* List Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-serif text-primary">Guest Reviews</h2>
          <p className="text-xs text-text-muted mt-1">
            Manage testimonials and guest reviews displayed in the homepage auto-scrolling carousel.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-md hover:scale-[1.02] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Review
        </button>
      </div>

      {fetchError && (
        <div className="p-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
          {(fetchError as any).message || "Failed to load reviews."}
        </div>
      )}

      {/* Reviews Grid */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-black/[0.08] rounded-2xl bg-bg-tan/10 text-xs text-text-muted">
          No reviews added yet. Click "Add Review" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev: any) => {
            return (
              <div
                key={rev.id}
                className="bg-white rounded-3xl border border-black/[0.06] p-6 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                {/* Accent Decoration */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-accent-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    {/* Stars & Quote */}
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent-gold text-accent-gold" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-bg-tan/60 stroke-[1.5]" />
                  </div>

                  <p className="text-xs text-text-muted italic leading-relaxed font-sans mb-6">
                    "{rev.description}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-black/[0.04] mt-2">
                  <div>
                    <h4 className="text-xs font-bold text-primary">{rev.name}</h4>
                    {rev.otherInfo && (
                      <span className="text-[10px] text-text-muted font-sans font-light">
                        {rev.otherInfo}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1">
                    <span className="text-[8px] font-bold text-text-muted bg-bg-tan/30 px-2 py-0.5 rounded-full mr-2 uppercase">
                      Sort: {rev.sortOrder}
                    </span>
                    <button
                      onClick={() => handleOpenEdit(rev)}
                      className="p-2 rounded-lg hover:bg-bg-tan/40 text-text-muted hover:text-primary transition-colors cursor-pointer"
                      title="Edit Review"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      <ReviewFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedReview}
        error={submitError}
      />
    </div>
  );
}
