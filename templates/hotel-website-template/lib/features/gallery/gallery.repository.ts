import { prisma } from "@/lib/database/prisma";
import type { GalleryImage } from "@prisma/client";
import type { GalleryImageInput } from "./gallery.types";

export class GalleryRepository {
  async listPublished(): Promise<GalleryImage[]> {
    return prisma.galleryImage.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  }

  async listAll(): Promise<GalleryImage[]> {
    return prisma.galleryImage.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  }

  async getById(id: string): Promise<GalleryImage | null> {
    return prisma.galleryImage.findUnique({ where: { id } });
  }

  async create(data: GalleryImageInput): Promise<GalleryImage> {
    return prisma.galleryImage.create({
      data: {
        title: data.title,
        category: data.category ?? "general",
        description: data.description ?? null,
        imageUrl: data.imageUrl,
        sortOrder: data.sortOrder ?? 0,
        published: data.published ?? true,
      },
    });
  }

  async update(id: string, data: Partial<GalleryImageInput>): Promise<GalleryImage> {
    return prisma.galleryImage.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        ...(data.published !== undefined && { published: data.published }),
      },
    });
  }

  async delete(id: string): Promise<GalleryImage> {
    return prisma.galleryImage.delete({ where: { id } });
  }
}

export const galleryRepository = new GalleryRepository();
