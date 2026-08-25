import { NextRequest, NextResponse } from "next/server";
import { hotelConfigController } from "@/lib/controllers/HotelConfigController";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return hotelConfigController.getConfig();
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }
  return hotelConfigController.updateConfig(req);
}
