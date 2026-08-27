import { NextRequest, NextResponse } from "next/server";
import { facilityController } from "@/lib/controllers/FacilityController";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return facilityController.getFacilities();
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }
  return facilityController.createFacility(req);
}
