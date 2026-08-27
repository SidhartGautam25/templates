import { NextRequest, NextResponse } from "next/server";
import { leadController } from "@/lib/controllers/LeadController";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }
  return leadController.getLeads();
}

export async function POST(req: NextRequest) {
  return leadController.createLead(req);
}
