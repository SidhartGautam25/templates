import { NextResponse } from "next/server";
import { galleryService, GalleryService } from "./gallery.service";

export class GalleryController {
  private service: GalleryService;

  constructor(service: GalleryService = galleryService) {
    this.service = service;
  }

  async listPublic(): Promise<NextResponse> {
    try {
      const data = await this.service.listPublic();
      return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch gallery";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  }

  async listAll(): Promise<NextResponse> {
    try {
      const data = await this.service.listAll();
      return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch gallery";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  }

  async create(req: Request): Promise<NextResponse> {
    try {
      const body = await req.json();
      const item = await this.service.create({
        title: body.title,
        category: body.category,
        description: body.description,
        imageUrl: body.imageUrl,
        sortOrder: body.sortOrder != null ? Number(body.sortOrder) : 0,
        published: body.published !== false,
      });
      return NextResponse.json({ success: true, data: item }, { status: 201 });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create gallery image";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
  }

  async update(req: Request, params: { id: string }): Promise<NextResponse> {
    try {
      const body = await req.json();
      const item = await this.service.update(params.id, {
        title: body.title,
        category: body.category,
        description: body.description,
        imageUrl: body.imageUrl,
        sortOrder: body.sortOrder != null ? Number(body.sortOrder) : undefined,
        published: body.published,
      });
      return NextResponse.json({ success: true, data: item }, { status: 200 });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update gallery image";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
  }

  async delete(params: { id: string }): Promise<NextResponse> {
    try {
      const item = await this.service.delete(params.id);
      return NextResponse.json({ success: true, data: item }, { status: 200 });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete gallery image";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
  }
}

export const galleryController = new GalleryController();
