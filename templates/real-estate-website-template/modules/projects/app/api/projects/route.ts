import { NextRequest, NextResponse } from "next/server";
import { projectController } from "@/lib/controllers/ProjectController";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return projectController.getProjects();
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }
  return projectController.createProject(req);
}
