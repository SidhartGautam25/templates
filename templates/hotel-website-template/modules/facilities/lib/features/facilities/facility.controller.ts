import { NextResponse } from "next/server";
import { facilityService, FacilityService } from "./facility.service";

export class FacilityController {
  private service: FacilityService;

  constructor(service: FacilityService = facilityService) {
    this.service = service;
  }

  async getFacilities(): Promise<NextResponse> {
    try {
      const list = await this.service.listFacilities();
      return NextResponse.json({ success: true, data: list }, { status: 200 });
    } catch (error: any) {
      console.error("GET /api/facilities error:", error);
      return NextResponse.json({ success: false, error: error.message || "Failed to fetch facilities" }, { status: 500 });
    }
  }

  async getFacility(req: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const id = params.id;
      const item = await this.service.getFacility(id);
      if (!item) {
        return NextResponse.json({ success: false, error: "Facility not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: item }, { status: 200 });
    } catch (error: any) {
      console.error("GET /api/facilities/:id error:", error);
      return NextResponse.json({ success: false, error: error.message || "Failed to fetch facility" }, { status: 500 });
    }
  }

  async createFacility(req: Request): Promise<NextResponse> {
    try {
      const body = await req.json();
      const item = await this.service.createFacility({
        title: body.title,
        description: body.description,
        icon: body.icon,
        sortOrder: body.sortOrder ? parseInt(body.sortOrder, 10) : 0,
      });
      return NextResponse.json({ success: true, data: item }, { status: 201 });
    } catch (error: any) {
      console.error("POST /api/facilities error:", error);
      return NextResponse.json({ success: false, error: error.message || "Failed to create facility" }, { status: 400 });
    }
  }

  async updateFacility(req: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const id = params.id;
      const body = await req.json();
      const updateData: any = {};
      if (body.title !== undefined) updateData.title = body.title;
      if (body.description !== undefined) updateData.description = body.description;
      if (body.icon !== undefined) updateData.icon = body.icon;
      if (body.sortOrder !== undefined) updateData.sortOrder = parseInt(body.sortOrder, 10) || 0;

      const item = await this.service.updateFacility(id, updateData);
      return NextResponse.json({ success: true, data: item }, { status: 200 });
    } catch (error: any) {
      console.error("PUT /api/facilities/:id error:", error);
      return NextResponse.json({ success: false, error: error.message || "Failed to update facility" }, { status: 400 });
    }
  }

  async deleteFacility(req: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const id = params.id;
      const deleted = await this.service.deleteFacility(id);
      return NextResponse.json({ success: true, data: deleted }, { status: 200 });
    } catch (error: any) {
      console.error("DELETE /api/facilities/:id error:", error);
      return NextResponse.json({ success: false, error: error.message || "Failed to delete facility" }, { status: 400 });
    }
  }
}

export const facilityController = new FacilityController();
