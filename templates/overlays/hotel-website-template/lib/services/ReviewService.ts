import { reviewRepository, ReviewRepository } from "../repositories/ReviewRepository";
import { Review } from "@prisma/client";
import { defaultReviews } from "@/constants/default-reviews";

export class ReviewService {
  private repo: ReviewRepository;

  constructor(repo: ReviewRepository = reviewRepository) {
    this.repo = repo;
  }

  async listReviews(): Promise<Review[]> {
    const items = await this.repo.getAll();
    if (items.length === 0) {
      return defaultReviews.map((item) => ({
        id: item.id,
        name: item.name,
        otherInfo: item.otherInfo,
        description: item.description,
        sortOrder: item.sortOrder ?? 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    }
    return items;
  }

  async getReview(id: string): Promise<Review | null> {
    const item = await this.repo.getById(id);
    if (!item) {
      const fallback = defaultReviews.find((r) => r.id === id);
      if (fallback) {
        return {
          id: fallback.id,
          name: fallback.name,
          otherInfo: fallback.otherInfo,
          description: fallback.description,
          sortOrder: fallback.sortOrder ?? 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }
    return item;
  }

  async createReview(data: {
    name: string;
    otherInfo?: string | null;
    description: string;
    sortOrder?: number;
  }): Promise<Review> {
    if (!data.name.trim()) throw new Error("Reviewer name is required.");
    if (!data.description.trim()) throw new Error("Review description is required.");

    return this.repo.create(data);
  }

  async updateReview(
    id: string,
    data: {
      name?: string;
      otherInfo?: string | null;
      description?: string;
      sortOrder?: number;
    }
  ): Promise<Review> {
    const existing = await this.repo.getById(id);
    if (!existing) {
      throw new Error("Review not found.");
    }
    return this.repo.update(id, data);
  }

  async deleteReview(id: string): Promise<Review> {
    const existing = await this.repo.getById(id);
    if (!existing) {
      throw new Error("Review not found.");
    }
    return this.repo.delete(id);
  }
}

export const reviewService = new ReviewService();
