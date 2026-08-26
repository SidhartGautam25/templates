import { roomTypeRepository, RoomTypeRepository } from "./room-type.repository";
import { storageService, IStorageService } from "@/lib/storage/StorageService";
import { RoomType } from "@prisma/client";
import { defaultRoomTypes } from "@/constants/default-room-types";
import { slugify } from "@/lib/utils/slugify";

export class RoomTypeService {
  private repo: RoomTypeRepository;
  private storage: IStorageService;

  constructor(repo: RoomTypeRepository = roomTypeRepository, storage: IStorageService = storageService) {
    this.repo = repo;
    this.storage = storage;
  }

  async listRoomTypes(): Promise<RoomType[]> {
    const items = await this.repo.getAll();
    if (items.length === 0) {
      return defaultRoomTypes.map((item) => ({
        id: item.id,
        name: item.name,
        startingPrice: item.startingPrice,
        size: item.size,
        view: item.view,
        bedType: item.bedType,
        bathrooms: item.bathrooms,
        amenities: item.amenities as any,
        ratePlans: item.ratePlans as any,
        image: item.image,
        sortOrder: item.sortOrder ?? 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    }
    return items;
  }

  async getRoomType(idOrSlug: string): Promise<RoomType | null> {
    const items = await this.repo.getAll();
    if (items.length === 0) {
      const found = defaultRoomTypes.find((r) => r.id === idOrSlug || slugify(r.name) === idOrSlug);
      if (found) {
        return {
          id: found.id,
          name: found.name,
          startingPrice: found.startingPrice,
          size: found.size,
          view: found.view,
          bedType: found.bedType,
          bathrooms: found.bathrooms,
          amenities: found.amenities as any,
          ratePlans: found.ratePlans as any,
          image: found.image,
          sortOrder: found.sortOrder ?? 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
      return null;
    }

    const direct = await this.repo.getById(idOrSlug);
    if (direct) return direct;

    const byName = items.find((r) => slugify(r.name) === idOrSlug);
    return byName || null;
  }

  async createRoomType(data: {
    name: string;
    startingPrice: number;
    size: string;
    view: string;
    bedType: string;
    bathrooms: string;
    amenities: any;
    ratePlans: any;
    imageFile?: File | null;
    galleryFiles?: File[];
    imagePath?: string;
    sortOrder?: number;
  }): Promise<{ roomType: RoomType; logs: string[] }> {
    if (!data.name.trim()) throw new Error("Room Type name is required.");
    if (data.startingPrice <= 0) throw new Error("Starting price must be greater than 0.");

    const existing = await this.repo.getByName(data.name);
    if (existing) {
      throw new Error(`A room type named '${data.name}' already exists.`);
    }

    const uploadLogs: string[] = [];
    let imageUrl = data.imagePath || "";

    if (data.imageFile) {
      const res = await this.storage.uploadFile(data.imageFile, "assets");
      imageUrl = res.url;
      if (res.logs) uploadLogs.push(...res.logs);
    }

    if (!imageUrl) {
      throw new Error("Room type image file or path is required.");
    }

    const imagesList = [imageUrl];
    if (data.galleryFiles && data.galleryFiles.length > 0) {
      for (const file of data.galleryFiles) {
        const res = await this.storage.uploadFile(file, "assets");
        imagesList.push(res.url);
        if (res.logs) uploadLogs.push(...res.logs);
      }
    }

    const roomType = await this.repo.create({
      name: data.name,
      startingPrice: Number(data.startingPrice),
      size: data.size,
      view: data.view,
      bedType: data.bedType,
      bathrooms: data.bathrooms,
      amenities: data.amenities,
      ratePlans: data.ratePlans,
      image: JSON.stringify(imagesList),
      sortOrder: data.sortOrder ?? 0,
    });

    return { roomType, logs: uploadLogs };
  }

  async updateRoomType(
    id: string,
    data: {
      name?: string;
      startingPrice?: number;
      size?: string;
      view?: string;
      bedType?: string;
      bathrooms?: string;
      amenities?: any;
      ratePlans?: any;
      imageFile?: File | null;
      galleryFiles?: File[];
      existingGallery?: string[];
      sortOrder?: number;
    }
  ): Promise<{ roomType: RoomType; logs: string[] }> {
    const existing = await this.repo.getById(id);
    if (!existing) {
      throw new Error("Room type not found.");
    }

    const uploadLogs: string[] = [];
    const currentImages = existing.image.startsWith("[")
      ? (() => {
          try {
            return JSON.parse(existing.image) as string[];
          } catch {
            return [existing.image];
          }
        })()
      : [existing.image];

    let newCoverUrl = currentImages[0] || "";

    if (data.imageFile) {
      const res = await this.storage.uploadFile(data.imageFile, "assets");
      newCoverUrl = res.url;
      if (res.logs) uploadLogs.push(...res.logs);
      
      if (currentImages[0] && currentImages[0].startsWith("/assets/") && currentImages[0].includes("-")) {
        await this.storage.deleteFile(currentImages[0]);
      }
    }

    const retainedGallery = data.existingGallery || [];

    const deletedImages = currentImages.slice(1).filter((img) => !retainedGallery.includes(img));
    for (const deletedImg of deletedImages) {
      if (deletedImg.startsWith("/assets/") && deletedImg.includes("-")) {
        await this.storage.deleteFile(deletedImg);
      }
    }

    const uploadedGalleryUrls: string[] = [];
    if (data.galleryFiles && data.galleryFiles.length > 0) {
      for (const file of data.galleryFiles) {
        const res = await this.storage.uploadFile(file, "assets");
        uploadedGalleryUrls.push(res.url);
        if (res.logs) uploadLogs.push(...res.logs);
      }
    }

    const finalImagesList = [newCoverUrl, ...retainedGallery, ...uploadedGalleryUrls];

    const updateData: any = { ...data };
    delete updateData.imageFile;
    delete updateData.galleryFiles;
    delete updateData.existingGallery;

    if (data.startingPrice !== undefined) {
      updateData.startingPrice = Number(data.startingPrice);
    }
    updateData.image = JSON.stringify(finalImagesList);

    const roomType = await this.repo.update(id, updateData);

    return { roomType, logs: uploadLogs };
  }

  async deleteRoomType(id: string): Promise<RoomType> {
    const existing = await this.repo.getById(id);
    if (!existing) {
      throw new Error("Room type not found.");
    }

    const deleted = await this.repo.delete(id);

    if (existing.image.includes("-")) {
      await this.storage.deleteFile(existing.image);
    }

    return deleted;
  }
}

export const roomTypeService = new RoomTypeService();
