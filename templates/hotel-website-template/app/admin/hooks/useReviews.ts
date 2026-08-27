"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface ReviewDataInput {
  id?: string;
  name: string;
  otherInfo?: string | null;
  description: string;
  sortOrder: number;
}

async function fetchReviews(): Promise<ReviewDataInput[]> {
  const res = await fetch("/api/reviews");
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || "Failed to load reviews");
  return json.data;
}

export function useGetReviews() {
  return useQuery({ queryKey: ["reviews"], queryFn: fetchReviews });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: ReviewDataInput) => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to create");
      return json.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}

export function useUpdateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: ReviewDataInput) => {
      if (!data.id) throw new Error("Missing id");
      const res = await fetch(`/api/reviews/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to update");
      return json.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete");
      return json.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}
