import type { Review } from "@prisma/client";
import { reviewRepository, ReviewRepository, type ReviewInput } from "./review.repository";

export class ReviewService {
  private repo: ReviewRepository;

  constructor(repo: ReviewRepository = reviewRepository) {
    this.repo = repo;
  }

  async listReviews(): Promise<Review[]> {
    return this.repo.getAll();
  }

  async getReview(id: string): Promise<Review | null> {
    return this.repo.getById(id);
  }

  async createReview(data: ReviewInput): Promise<Review> {
    if (!data.name?.trim()) throw new Error("Reviewer name is required.");
    if (!data.description?.trim()) throw new Error("Review text is required.");
    return this.repo.create(data);
  }

  async updateReview(id: string, data: Partial<ReviewInput>): Promise<Review> {
    const existing = await this.repo.getById(id);
    if (!existing) throw new Error("Review not found.");
    return this.repo.update(id, data);
  }

  async deleteReview(id: string): Promise<Review> {
    const existing = await this.repo.getById(id);
    if (!existing) throw new Error("Review not found.");
    return this.repo.delete(id);
  }
}

export const reviewService = new ReviewService();
