import type { ComposeDocument } from "@/lib/blog/compose";

export interface BlogPostInput {
  title: string;
  slug?: string;
  excerpt?: string | null;
  coverImage?: string | null;
  engine?: string;
  content: ComposeDocument;
  published?: boolean;
}

export interface BlogPostUpdate {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  coverImage?: string | null;
  content?: ComposeDocument;
  published?: boolean;
}
