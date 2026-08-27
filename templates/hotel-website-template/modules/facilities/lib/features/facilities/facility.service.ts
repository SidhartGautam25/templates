import { facilityRepository, FacilityRepository } from "./facility.repository";
import { Facility } from "@prisma/client";
import { defaultFacilities } from "@/constants/default-facilities";

export class FacilityService {
  private repo: FacilityRepository;

  constructor(repo: FacilityRepository = facilityRepository) {
    this.repo = repo;
  }

  async listFacilities(): Promise<Facility[]> {
    const items = await this.repo.getAll();
    if (items.length === 0) {
      return defaultFacilities.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        icon: item.icon,
        sortOrder: item.sortOrder ?? 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    }
    return items;
  }

  async getFacility(id: string): Promise<Facility | null> {
    const item = await this.repo.getById(id);
    if (!item) {
      const fallback = defaultFacilities.find((f) => f.id === id);
      if (fallback) {
        return {
          id: fallback.id,
          title: fallback.title,
          description: fallback.description,
          icon: fallback.icon,
          sortOrder: fallback.sortOrder ?? 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }
    return item;
  }

  async createFacility(data: {
    title: string;
    description: string;
    icon: string;
    sortOrder?: number;
  }): Promise<Facility> {
    if (!data.title.trim()) throw new Error("Facility title is required.");
    if (!data.description.trim()) throw new Error("Facility description is required.");
    if (!data.icon.trim()) throw new Error("Facility icon is required.");

    const existing = await this.repo.getByTitle(data.title);
    if (existing) {
      throw new Error(`A facility with title '${data.title}' already exists.`);
    }

    return this.repo.create(data);
  }

  async updateFacility(
    id: string,
    data: {
      title?: string;
      description?: string;
      icon?: string;
      sortOrder?: number;
    }
  ): Promise<Facility> {
    const existing = await this.repo.getById(id);
    if (!existing) {
      throw new Error("Facility not found.");
    }

    if (data.title && data.title !== existing.title) {
      const titleExists = await this.repo.getByTitle(data.title);
      if (titleExists) {
        throw new Error(`A facility with title '${data.title}' already exists.`);
      }
    }

    return this.repo.update(id, data);
  }

  async deleteFacility(id: string): Promise<Facility> {
    const existing = await this.repo.getById(id);
    if (!existing) {
      throw new Error("Facility not found.");
    }
    return this.repo.delete(id);
  }
}

export const facilityService = new FacilityService();
