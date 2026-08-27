import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { agencyController } from "@/lib/controllers/AgencyController";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  return agencyController.listWork(Boolean(session));
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  return agencyController.createWork(req);
}
