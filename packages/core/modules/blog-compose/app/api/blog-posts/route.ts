import { NextRequest } from "next/server";
import { blogComposeController } from "@/lib/controllers/BlogComposeController";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (session) {
    return blogComposeController.listAll();
  }
  return blogComposeController.listPublic();
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  return blogComposeController.create(req);
}
