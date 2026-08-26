import { NextResponse } from "next/server";
import { reviewService, ReviewService } from "../services/ReviewService";

export class ReviewController {
  private service: ReviewService;

  constructor(service: ReviewService = reviewService) {
    this.service = service;
  }

  async getReviews(): Promise<NextResponse> {
    try {
      const list = await this.service.listReviews();
      return NextResponse.json({ success: true, data: list }, { status: 200 });
    } catch (error: any) {
      console.error("GET /api/reviews error:", error);
      return NextResponse.json({ success: false, error: error.message || "Failed to fetch reviews" }, { status: 500 });
    }
  }

  async getReview(req: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const id = params.id;
      const item = await this.service.getReview(id);
      if (!item) {
        return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: item }, { status: 200 });
    } catch (error: any) {
      console.error("GET /api/reviews/:id error:", error);
      return NextResponse.json({ success: false, error: error.message || "Failed to fetch review" }, { status: 500 });
    }
  }

  async createReview(req: Request): Promise<NextResponse> {
    try {
      const body = await req.json();
      const item = await this.service.createReview({
        name: body.name,
        otherInfo: body.otherInfo,
        description: body.description,
        sortOrder: body.sortOrder ? parseInt(body.sortOrder, 10) : 0,
      });
      return NextResponse.json({ success: true, data: item }, { status: 201 });
    } catch (error: any) {
      console.error("POST /api/reviews error:", error);
      return NextResponse.json({ success: false, error: error.message || "Failed to create review" }, { status: 400 });
    }
  }

  async updateReview(req: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const id = params.id;
      const body = await req.json();
      const updateData: any = {};
      if (body.name !== undefined) updateData.name = body.name;
      if (body.otherInfo !== undefined) updateData.otherInfo = body.otherInfo;
      if (body.description !== undefined) updateData.description = body.description;
      if (body.sortOrder !== undefined) updateData.sortOrder = parseInt(body.sortOrder, 10) || 0;

      const item = await this.service.updateReview(id, updateData);
      return NextResponse.json({ success: true, data: item }, { status: 200 });
    } catch (error: any) {
      console.error("PUT /api/reviews/:id error:", error);
      return NextResponse.json({ success: false, error: error.message || "Failed to update review" }, { status: 400 });
    }
  }

  async deleteReview(req: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const id = params.id;
      const deleted = await this.service.deleteReview(id);
      return NextResponse.json({ success: true, data: deleted }, { status: 200 });
    } catch (error: any) {
      console.error("DELETE /api/reviews/:id error:", error);
      return NextResponse.json({ success: false, error: error.message || "Failed to delete review" }, { status: 400 });
    }
  }
}

export const reviewController = new ReviewController();
