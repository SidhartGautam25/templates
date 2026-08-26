import { NextRequest, NextResponse } from "next/server";
import { reviewController } from "@/lib/controllers/ReviewController";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, props: RouteParams) {
  const params = await props.params;
  return reviewController.getReview(req, { params });
}

export async function PUT(req: NextRequest, props: RouteParams) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }
  const params = await props.params;
  return reviewController.updateReview(req, { params });
}

export async function DELETE(req: NextRequest, props: RouteParams) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }
  const params = await props.params;
  return reviewController.deleteReview(req, { params });
}
