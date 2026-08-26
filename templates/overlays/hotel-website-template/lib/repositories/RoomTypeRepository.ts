import { prisma } from "../db";
import { RoomType } from "@prisma/client";

export class RoomTypeRepository {
  async getAll(): Promise<RoomType[]> {
    return prisma.roomType.findMany({
      orderBy: [
        { sortOrder: "desc" },
        { createdAt: "desc" }
      ],
    });
  }

  async getById(id: string): Promise<RoomType | null> {
    return prisma.roomType.findUnique({
      where: { id },
    });
  }

  async getByName(name: string): Promise<RoomType | null> {
    return prisma.roomType.findUnique({
      where: { name },
    });
  }

  async create(data: {
    name: string;
    startingPrice: number;
    size: string;
    view: string;
    bedType: string;
    bathrooms: string;
    amenities: any;
    ratePlans: any;
    image: string;
    sortOrder?: number;
  }): Promise<RoomType> {
    return prisma.roomType.create({
      data: {
        name: data.name,
        startingPrice: data.startingPrice,
        size: data.size,
        view: data.view,
        bedType: data.bedType,
        bathrooms: data.bathrooms,
        amenities: data.amenities,
        ratePlans: data.ratePlans,
        image: data.image,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async update(
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
      image?: string;
      sortOrder?: number;
    }
  ): Promise<RoomType> {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.startingPrice !== undefined) updateData.startingPrice = data.startingPrice;
    if (data.size !== undefined) updateData.size = data.size;
    if (data.view !== undefined) updateData.view = data.view;
    if (data.bedType !== undefined) updateData.bedType = data.bedType;
    if (data.bathrooms !== undefined) updateData.bathrooms = data.bathrooms;
    if (data.amenities !== undefined) updateData.amenities = data.amenities;
    if (data.ratePlans !== undefined) updateData.ratePlans = data.ratePlans;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    return prisma.roomType.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<RoomType> {
    return prisma.roomType.delete({
      where: { id },
    });
  }
}

export const roomTypeRepository = new RoomTypeRepository();
