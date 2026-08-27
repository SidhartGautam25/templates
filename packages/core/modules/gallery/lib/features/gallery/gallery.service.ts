import type { GalleryImage } from "@prisma/client";
import { galleryRepository, GalleryRepository } from "./gallery.repository";
import type { GalleryImageInput } from "./gallery.types";

export class GalleryService {
  private repo: GalleryRepository;

  constructor(repo: GalleryRepository = galleryRepository) {
    this.repo = repo;
  }

  async listPublic(): Promise<GalleryImage[]> {
    return this.repo.listPublished();
  }

  async listAll(): Promise<GalleryImage[]> {
    return this.repo.listAll();
  }

  async getById(id: string): Promise<GalleryImage | null> {
    return this.repo.getById(id);
  }

  async create(data: GalleryImageInput): Promise<GalleryImage> {
    if (!data.title?.trim()) throw new Error("Title is required.");
    if (!data.imageUrl?.trim()) throw new Error("Image URL is required.");
    return this.repo.create(data);
  }

  async update(id: string, data: Partial<GalleryImageInput>): Promise<GalleryImage> {
    const existing = await this.repo.getById(id);
    if (!existing) throw new Error("Gallery image not found.");
    return this.repo.update(id, data);
  }

  async delete(id: string): Promise<GalleryImage> {
    const existing = await this.repo.getById(id);
    if (!existing) throw new Error("Gallery image not found.");
    return this.repo.delete(id);
  }
}

export const galleryService = new GalleryService();
