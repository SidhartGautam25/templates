import { NextResponse } from "next/server";
import { blogComposeService, BlogComposeService } from "./blog-compose.service";

export class BlogComposeController {
  private service: BlogComposeService;

  constructor(service: BlogComposeService = blogComposeService) {
    this.service = service;
  }

  async listPublic(): Promise<NextResponse> {
    try {
      const data = await this.service.listPublic();
      return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch blog posts";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  }

  async listAll(): Promise<NextResponse> {
    try {
      const data = await this.service.listAll();
      return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch blog posts";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  }

  async create(req: Request): Promise<NextResponse> {
    try {
      const body = await req.json();
      const item = await this.service.create({
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        coverImage: body.coverImage,
        content: body.content,
        published: body.published === true,
      });
      return NextResponse.json({ success: true, data: item }, { status: 201 });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create blog post";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
  }

  async update(req: Request, params: { id: string }): Promise<NextResponse> {
    try {
      const body = await req.json();
      const item = await this.service.update(params.id, {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        coverImage: body.coverImage,
        content: body.content,
        published: body.published,
      });
      return NextResponse.json({ success: true, data: item }, { status: 200 });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update blog post";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
  }

  async delete(params: { id: string }): Promise<NextResponse> {
    try {
      const item = await this.service.delete(params.id);
      return NextResponse.json({ success: true, data: item }, { status: 200 });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete blog post";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
  }
}

export const blogComposeController = new BlogComposeController();
