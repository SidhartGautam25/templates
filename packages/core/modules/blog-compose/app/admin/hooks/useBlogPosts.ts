"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEmptyComposeDocument,
  isComposeDocument,
  type ComposeDocument,
} from "@/lib/blog/compose";

export interface BlogPostData {
  id?: string;
  title: string;
  slug?: string;
  excerpt?: string | null;
  coverImage?: string | null;
  published?: boolean;
  content: ComposeDocument;
}

interface BlogPostApiRow {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  coverImage?: string | null;
  published?: boolean;
  contentJson?: unknown;
  content?: ComposeDocument;
}

function mapApiPost(row: BlogPostApiRow): BlogPostData {
  const content =
    row.content ??
    (isComposeDocument(row.contentJson) ? row.contentJson : createEmptyComposeDocument());
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    coverImage: row.coverImage,
    published: row.published,
    content,
  };
}

export function useGetBlogPosts() {
  return useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const res = await fetch("/api/blog-posts");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to load blog posts");
      return (json.data as BlogPostApiRow[]).map(mapApiPost);
    },
  });
}

export function useCreateBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: BlogPostData) => {
      const res = await fetch("/api/blog-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to create post");
      return json.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog-posts"] }),
  });
}

export function useUpdateBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BlogPostData }) => {
      const res = await fetch(`/api/blog-posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to update post");
      return json.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog-posts"] }),
  });
}

export function useDeleteBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/blog-posts/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to delete post");
      return json.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog-posts"] }),
  });
}
