import type { ComposeBlock, ComposeDocument } from "@/lib/blog-compose/types";
import { isComposeDocument } from "@/lib/blog-compose/types";

export interface BlogPostEntry {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  author?: string;
  content: ComposeDocument;
}

export interface BlogPostsRegistry {
  posts: BlogPostEntry[];
}

function parseRegistry(data: BlogPostsRegistry): BlogPostEntry[] {
  return data.posts.filter(
    (post) => post.slug && post.title && isComposeDocument(post.content)
  );
}

export function getAllBlogPosts(registry: BlogPostsRegistry): BlogPostEntry[] {
  return parseRegistry(registry).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getBlogPostBySlug(registry: BlogPostsRegistry, slug: string): BlogPostEntry | null {
  return parseRegistry(registry).find((p) => p.slug === slug) ?? null;
}

export function getBlogPostSlugs(registry: BlogPostsRegistry): string[] {
  return parseRegistry(registry).map((p) => p.slug);
}

export type { ComposeBlock, ComposeDocument };
