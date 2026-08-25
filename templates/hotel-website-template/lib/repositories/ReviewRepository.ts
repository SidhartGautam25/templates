import { prisma } from "../db";
import { Review } from "@prisma/client";

export class ReviewRepository {
  async getAll(): Promise<Review[]> {
    return prisma.review.findMany({
      orderBy: [
        { sortOrder: "desc" },
        { createdAt: "desc" }
      ],
    });
  }

  async getById(id: string): Promise<Review | null> {
    return prisma.review.findUnique({
      where: { id },
    });
  }

  async create(data: {
    name: string;
    otherInfo?: string | null;
    description: string;
    sortOrder?: number;
  }): Promise<Review> {
    return prisma.review.create({
      data: {
        name: data.name,
        otherInfo: data.otherInfo ?? null,
        description: data.description,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      otherInfo?: string | null;
      description?: string;
      sortOrder?: number;
    }
  ): Promise<Review> {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.otherInfo !== undefined) updateData.otherInfo = data.otherInfo;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    return prisma.review.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<Review> {
    return prisma.review.delete({
      where: { id },
    });
  }
}

export const reviewRepository = new ReviewRepository();
