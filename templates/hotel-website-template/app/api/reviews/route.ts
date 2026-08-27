import { NextRequest } from "next/server";
import { reviewController } from "@/lib/controllers/ReviewController";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return reviewController.getReviews();
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  return reviewController.createReview(req);
}
