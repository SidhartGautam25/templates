import { NextResponse } from "next/server";
import { reviewService, ReviewService } from "./review.service";

export class ReviewController {
  private service: ReviewService;

  constructor(service: ReviewService = reviewService) {
    this.service = service;
  }

  async getReviews(): Promise<NextResponse> {
    try {
      const data = await this.service.listReviews();
      return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch reviews";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  }

  async createReview(req: Request): Promise<NextResponse> {
    try {
      const body = await req.json();
      const item = await this.service.createReview({
        name: body.name,
        otherInfo: body.otherInfo,
        description: body.description,
        sortOrder: body.sortOrder != null ? Number(body.sortOrder) : 0,
      });
      return NextResponse.json({ success: true, data: item }, { status: 201 });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create review";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
  }

  async updateReview(req: Request, params: { id: string }): Promise<NextResponse> {
    try {
      const body = await req.json();
      const item = await this.service.updateReview(params.id, {
        name: body.name,
        otherInfo: body.otherInfo,
        description: body.description,
        sortOrder: body.sortOrder != null ? Number(body.sortOrder) : undefined,
      });
      return NextResponse.json({ success: true, data: item }, { status: 200 });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update review";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
  }

  async deleteReview(params: { id: string }): Promise<NextResponse> {
    try {
      const item = await this.service.deleteReview(params.id);
      return NextResponse.json({ success: true, data: item }, { status: 200 });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete review";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
  }
}

export const reviewController = new ReviewController();
