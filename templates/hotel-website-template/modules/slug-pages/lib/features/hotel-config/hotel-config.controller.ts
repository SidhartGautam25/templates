import { NextResponse } from "next/server";
import { hotelConfigService, HotelConfigService } from "./hotel-config.service";

export class HotelConfigController {
  private service: HotelConfigService;

  constructor(service: HotelConfigService = hotelConfigService) {
    this.service = service;
  }

  async getConfig(): Promise<NextResponse> {
    try {
      const config = await this.service.getConfig();
      return NextResponse.json({ success: true, data: config }, { status: 200 });
    } catch (error: any) {
      console.error("GET /api/hotel-config error:", error);
      return NextResponse.json({ success: false, error: error.message || "Failed to fetch hotel config" }, { status: 500 });
    }
  }

  async updateConfig(req: Request): Promise<NextResponse> {
    try {
      const body = await req.json();
      const config = await this.service.updateConfig({
        address: body.address,
        templeDistance: body.templeDistance,
        phone: body.phone,
        email: body.email,
      });
      return NextResponse.json({ success: true, data: config }, { status: 200 });
    } catch (error: any) {
      console.error("PUT /api/hotel-config error:", error);
      return NextResponse.json({ success: false, error: error.message || "Failed to update hotel config" }, { status: 400 });
    }
  }
}

export const hotelConfigController = new HotelConfigController();
