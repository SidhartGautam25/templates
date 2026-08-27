import { NextRequest } from "next/server";
import { galleryController } from "@/lib/controllers/GalleryController";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth();
  const admin = Boolean(session);
  if (admin) {
    return galleryController.listAll();
  }
  return galleryController.listPublic();
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  return galleryController.create(req);
}
