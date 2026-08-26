import { NextRequest, NextResponse } from "next/server";
import { reviewController } from "@/lib/controllers/ReviewController";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return reviewController.getReviews();
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }
  return reviewController.createReview(req);
}
