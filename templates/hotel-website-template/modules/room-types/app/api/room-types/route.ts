import { NextRequest, NextResponse } from "next/server";
import { roomTypeController } from "@/lib/controllers/RoomTypeController";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return roomTypeController.getRoomTypes();
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }
  return roomTypeController.createRoomType(req);
}
