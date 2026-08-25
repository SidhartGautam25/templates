import { prisma } from "../db";
import { Project } from "@prisma/client";

export class ProjectRepository {
  async getAll(): Promise<Project[]> {
    return prisma.project.findMany({
      orderBy: [
        { sortOrder: "desc" },
        { createdAt: "desc" }
      ],
    });
  }

  async getById(id: string): Promise<Project | null> {
    return prisma.project.findUnique({
      where: { id },
    });
  }

  async getByName(name: string): Promise<Project | null> {
    return prisma.project.findUnique({
      where: { name },
    });
  }

  async create(data: {
    name: string;
    location: string;
    typology: string;
    price: string;
    image: string;
    possession?: string | null;
    tag1?: string | null;
    tag2?: string | null;
    highlights: string[];
    rera: string;
    reraId?: string | null;
    reraLabel?: string | null;
    reraQrImage?: string | null;
    category: string;
    description?: string | null;
    amenities?: any;
    gallery?: any;
    floorPlans?: any;
    isNewLaunch?: boolean;
    sortOrder?: number;
  }): Promise<Project> {
    return prisma.project.create({
      data: {
        name: data.name,
        location: data.location,
        typology: data.typology,
        price: data.price,
        image: data.image,
        possession: data.possession || null,
        tag1: data.tag1 || null,
        tag2: data.tag2 || null,
        highlights: data.highlights,
        rera: data.rera,
        reraId: data.reraId || null,
        reraLabel: data.reraLabel || null,
        reraQrImage: data.reraQrImage || null,
        category: data.category,
        description: data.description || null,
        amenities: data.amenities || null,
        gallery: data.gallery || null,
        floorPlans: data.floorPlans || null,
        isNewLaunch: data.isNewLaunch ?? false,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      location?: string;
      typology?: string;
      price?: string;
      image?: string;
      possession?: string | null;
      tag1?: string | null;
      tag2?: string | null;
      highlights?: string[];
      rera?: string;
      reraId?: string | null;
      reraLabel?: string | null;
      reraQrImage?: string | null;
      category?: string;
      description?: string | null;
      amenities?: any;
      gallery?: any;
      floorPlans?: any;
      isNewLaunch?: boolean;
      sortOrder?: number;
    }
  ): Promise<Project> {
    return prisma.project.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Project> {
    return prisma.project.delete({
      where: { id },
    });
  }
}

export const projectRepository = new ProjectRepository();
