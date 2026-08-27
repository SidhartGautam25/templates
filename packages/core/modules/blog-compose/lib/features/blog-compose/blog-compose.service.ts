import type { BlogPost } from "@prisma/client";
import { slugify } from "@/lib/utils/slugify";
import {
  createEmptyComposeDocument,
  isComposeDocument,
  type ComposeDocument,
} from "@/lib/blog/compose";
import { blogComposeRepository, BlogComposeRepository } from "./blog-compose.repository";
import type { BlogPostInput, BlogPostUpdate } from "./blog-compose.types";

export class BlogComposeService {
  private repo: BlogComposeRepository;

  constructor(repo: BlogComposeRepository = blogComposeRepository) {
    this.repo = repo;
  }

  private parseContent(json: unknown): ComposeDocument {
    if (isComposeDocument(json)) return json;
    return createEmptyComposeDocument();
  }

  private resolveSlug(title: string, slug?: string): string {
    const base = slug?.trim() || slugify(title);
    if (!base) throw new Error("Slug is required.");
    return base;
  }

  async listPublic(): Promise<BlogPost[]> {
    return this.repo.listPublished();
  }

  async listAll(): Promise<BlogPost[]> {
    return this.repo.listAll();
  }

  async getById(id: string): Promise<BlogPost | null> {
    return this.repo.getById(id);
  }

  async getPublishedBySlug(slug: string): Promise<BlogPost | null> {
    return this.repo.getBySlug(slug, true);
  }

  async create(data: BlogPostInput): Promise<BlogPost> {
    if (!data.title?.trim()) throw new Error("Title is required.");
    if (!isComposeDocument(data.content)) throw new Error("Invalid compose document.");
    const slug = this.resolveSlug(data.title, data.slug);
    return this.repo.create({ ...data, slug });
  }

  async update(id: string, data: BlogPostUpdate): Promise<BlogPost> {
    if (data.content && !isComposeDocument(data.content)) {
      throw new Error("Invalid compose document.");
    }
    const slug =
      data.slug !== undefined
        ? this.resolveSlug(data.title ?? "post", data.slug)
        : undefined;
    return this.repo.update(id, { ...data, slug });
  }

  async delete(id: string): Promise<BlogPost> {
    return this.repo.delete(id);
  }

  contentFromPost(post: BlogPost): ComposeDocument {
    return this.parseContent(post.contentJson);
  }
}

export const blogComposeService = new BlogComposeService();
