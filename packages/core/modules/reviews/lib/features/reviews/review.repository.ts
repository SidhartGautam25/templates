import { prisma } from "@/lib/database/prisma";
import type { Review } from "@prisma/client";

export interface ReviewInput {
  name: string;
  otherInfo?: string | null;
  description: string;
  sortOrder?: number;
}

export class ReviewRepository {
  async getAll(): Promise<Review[]> {
    return prisma.review.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  }

  async getById(id: string): Promise<Review | null> {
    return prisma.review.findUnique({ where: { id } });
  }

  async create(data: ReviewInput): Promise<Review> {
    return prisma.review.create({
      data: {
        name: data.name,
        otherInfo: data.otherInfo ?? null,
        description: data.description,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async update(id: string, data: Partial<ReviewInput>): Promise<Review> {
    return prisma.review.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.otherInfo !== undefined && { otherInfo: data.otherInfo }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      },
    });
  }

  async delete(id: string): Promise<Review> {
    return prisma.review.delete({ where: { id } });
  }
}

export const reviewRepository = new ReviewRepository();
