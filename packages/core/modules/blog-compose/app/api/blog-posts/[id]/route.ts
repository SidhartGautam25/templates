import { NextRequest } from "next/server";
import { blogComposeController } from "@/lib/controllers/BlogComposeController";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  return blogComposeController.update(req, { id });
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  return blogComposeController.delete({ id });
}
