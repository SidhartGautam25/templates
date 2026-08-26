import { NextResponse } from "next/server";
import { roomTypeService, RoomTypeService } from "./room-type.service";

export class RoomTypeController {
  private service: RoomTypeService;

  constructor(service: RoomTypeService = roomTypeService) {
    this.service = service;
  }

  async getRoomTypes(): Promise<NextResponse> {
    try {
      const list = await this.service.listRoomTypes();
      return NextResponse.json({ success: true, data: list }, { status: 200 });
    } catch (error: any) {
      console.error("GET /api/room-types error:", error);
      return NextResponse.json({ success: false, error: error.message || "Failed to fetch room types" }, { status: 500 });
    }
  }

  async getRoomType(req: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const id = params.id;
      const roomType = await this.service.getRoomType(id);
      if (!roomType) {
        return NextResponse.json({ success: false, error: "Room type not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: roomType }, { status: 200 });
    } catch (error: any) {
      console.error("GET /api/room-types/:id error:", error);
      return NextResponse.json({ success: false, error: error.message || "Failed to fetch room type" }, { status: 500 });
    }
  }

  async createRoomType(req: Request): Promise<NextResponse> {
    try {
      const contentType = req.headers.get("content-type") || "";
      if (!contentType.includes("multipart/form-data")) {
        return NextResponse.json({ success: false, error: "Content type must be multipart/form-data" }, { status: 400 });
      }

      const formData = await req.formData();
      
      const name = formData.get("name") as string;
      const startingPrice = Number(formData.get("startingPrice") || 0);
      const size = formData.get("size") as string;
      const view = formData.get("view") as string;
      const bedType = formData.get("bedType") as string;
      const bathrooms = formData.get("bathrooms") as string;
      const sortOrderRaw = formData.get("sortOrder");
      const sortOrder = sortOrderRaw ? parseInt(sortOrderRaw as string, 10) : 0;
      
      const amenitiesRaw = formData.get("amenities") as string | null;
      let amenities: any = { popular: [], features: [], basic: [], media: [], bathroom: [] };
      if (amenitiesRaw) {
        try {
          amenities = JSON.parse(amenitiesRaw);
        } catch {
          // Fallback if not JSON
        }
      }

      const ratePlansRaw = formData.get("ratePlans") as string | null;
      let ratePlans: any[] = [];
      if (ratePlansRaw) {
        try {
          ratePlans = JSON.parse(ratePlansRaw);
        } catch {
          // Fallback
        }
      }

      const imageFile = formData.get("image") as File | null;
      const galleryFiles = formData.getAll("gallery") as File[];

      const { roomType, logs } = await this.service.createRoomType({
        name,
        startingPrice,
        size,
        view,
        bedType,
        bathrooms,
        amenities,
        ratePlans,
        imageFile,
        galleryFiles,
        sortOrder,
      });

      return NextResponse.json({ success: true, data: roomType, logs }, { status: 201 });
    } catch (error: any) {
      console.error("POST /api/room-types error:", error);
      return NextResponse.json({ success: false, error: error.message || "Failed to create room type" }, { status: 400 });
    }
  }

  async updateRoomType(req: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const id = params.id;
      const contentType = req.headers.get("content-type") || "";
      
      let updateData: any = {};

      if (contentType.includes("multipart/form-data")) {
        const formData = await req.formData();
        
        if (formData.has("name")) updateData.name = formData.get("name") as string;
        if (formData.has("startingPrice")) updateData.startingPrice = Number(formData.get("startingPrice") || 0);
        if (formData.has("size")) updateData.size = formData.get("size") as string;
        if (formData.has("view")) updateData.view = formData.get("view") as string;
        if (formData.has("bedType")) updateData.bedType = formData.get("bedType") as string;
        if (formData.has("bathrooms")) updateData.bathrooms = formData.get("bathrooms") as string;
        
        if (formData.has("sortOrder")) {
          const rawOrder = formData.get("sortOrder");
          updateData.sortOrder = rawOrder ? parseInt(rawOrder as string, 10) : 0;
        }

        if (formData.has("image")) {
          updateData.imageFile = formData.get("image") as File | null;
        }

        if (formData.has("gallery")) {
          updateData.galleryFiles = formData.getAll("gallery") as File[];
        }

        if (formData.has("existingGallery")) {
          try {
            updateData.existingGallery = JSON.parse(formData.get("existingGallery") as string);
          } catch {
            updateData.existingGallery = [];
          }
        }

        if (formData.has("amenities")) {
          const amenitiesRaw = formData.get("amenities") as string;
          try {
            updateData.amenities = JSON.parse(amenitiesRaw);
          } catch {
            // ignore
          }
        }

        if (formData.has("ratePlans")) {
          const ratePlansRaw = formData.get("ratePlans") as string;
          try {
            updateData.ratePlans = JSON.parse(ratePlansRaw);
          } catch {
            // ignore
          }
        }
      } else {
        const body = await req.json();
        updateData = body;
      }

      const { roomType, logs } = await this.service.updateRoomType(id, updateData);
      return NextResponse.json({ success: true, data: roomType, logs }, { status: 200 });
    } catch (error: any) {
      console.error("PUT /api/room-types/:id error:", error);
      return NextResponse.json({ success: false, error: error.message || "Failed to update room type" }, { status: 400 });
    }
  }

  async deleteRoomType(req: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const id = params.id;
      const deleted = await this.service.deleteRoomType(id);
      return NextResponse.json({ success: true, data: deleted }, { status: 200 });
    } catch (error: any) {
      console.error("DELETE /api/room-types/:id error:", error);
      return NextResponse.json({ success: false, error: error.message || "Failed to delete room type" }, { status: 400 });
    }
  }
}

export const roomTypeController = new RoomTypeController();
