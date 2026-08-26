import { prisma } from "@/lib/database/prisma";
import { Facility } from "@prisma/client";

export class FacilityRepository {
  async getAll(): Promise<Facility[]> {
    return prisma.facility.findMany({
      orderBy: [
        { sortOrder: "desc" },
        { createdAt: "desc" }
      ],
    });
  }

  async getById(id: string): Promise<Facility | null> {
    return prisma.facility.findUnique({
      where: { id },
    });
  }

  async getByTitle(title: string): Promise<Facility | null> {
    return prisma.facility.findUnique({
      where: { title },
    });
  }

  async create(data: {
    title: string;
    description: string;
    icon: string;
    sortOrder?: number;
  }): Promise<Facility> {
    return prisma.facility.create({
      data: {
        title: data.title,
        description: data.description,
        icon: data.icon,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      icon?: string;
      sortOrder?: number;
    }
  ): Promise<Facility> {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.icon !== undefined) updateData.icon = data.icon;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    return prisma.facility.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<Facility> {
    return prisma.facility.delete({
      where: { id },
    });
  }
}

export const facilityRepository = new FacilityRepository();
