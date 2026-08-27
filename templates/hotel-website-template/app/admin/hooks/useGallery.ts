"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface GalleryDataInput {
  id?: string;
  title: string;
  category: string;
  description?: string | null;
  imageUrl: string;
  sortOrder: number;
  published: boolean;
}

async function fetchGallery(): Promise<GalleryDataInput[]> {
  const res = await fetch("/api/gallery");
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || "Failed to load gallery");
  return json.data;
}

export function useGetGallery() {
  return useQuery({ queryKey: ["gallery"], queryFn: fetchGallery });
}

export function useCreateGalleryImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: GalleryDataInput) => {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to create");
      return json.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gallery"] }),
  });
}

export function useUpdateGalleryImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: GalleryDataInput) => {
      if (!data.id) throw new Error("Missing id");
      const res = await fetch(`/api/gallery/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to update");
      return json.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gallery"] }),
  });
}

export function useDeleteGalleryImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete");
      return json.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gallery"] }),
  });
}
