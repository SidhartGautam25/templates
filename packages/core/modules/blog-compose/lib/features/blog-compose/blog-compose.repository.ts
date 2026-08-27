import type { BlogPost, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { BlogPostInput, BlogPostUpdate } from "./blog-compose.types";

export class BlogComposeRepository {
  async listPublished(): Promise<BlogPost[]> {
    return prisma.blogPost.findMany({
      where: { published: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
  }

  async listAll(): Promise<BlogPost[]> {
    return prisma.blogPost.findMany({
      orderBy: [{ updatedAt: "desc" }],
    });
  }

  async getById(id: string): Promise<BlogPost | null> {
    return prisma.blogPost.findUnique({ where: { id } });
  }

  async getBySlug(slug: string, publishedOnly = true): Promise<BlogPost | null> {
    return prisma.blogPost.findFirst({
      where: publishedOnly ? { slug, published: true } : { slug },
    });
  }

  async create(data: BlogPostInput & { slug: string }): Promise<BlogPost> {
    const now = data.published ? new Date() : null;
    return prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        engine: data.engine ?? "compose",
        contentJson: data.content as unknown as Prisma.InputJsonValue,
        published: data.published ?? false,
        publishedAt: now,
      },
    });
  }

  async update(id: string, data: BlogPostUpdate & { slug?: string }): Promise<BlogPost> {
    const existing = await this.getById(id);
    if (!existing) throw new Error("Blog post not found.");

    let publishedAt = existing.publishedAt;
    if (data.published === true && !existing.published) {
      publishedAt = new Date();
    }
    if (data.published === false) {
      publishedAt = null;
    }

    const patch: Prisma.BlogPostUpdateInput = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      coverImage: data.coverImage,
      published: data.published,
      publishedAt,
    };

    if (data.content) {
      patch.contentJson = data.content as unknown as Prisma.InputJsonValue;
    }

    return prisma.blogPost.update({ where: { id }, data: patch });
  }

  async delete(id: string): Promise<BlogPost> {
    return prisma.blogPost.delete({ where: { id } });
  }
}

export const blogComposeRepository = new BlogComposeRepository();
