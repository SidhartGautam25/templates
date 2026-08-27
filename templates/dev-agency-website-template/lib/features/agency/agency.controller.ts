import { NextResponse } from "next/server";
import { agencyService, AgencyService } from "./agency.service";

export class AgencyController {
  private service: AgencyService;

  constructor(service: AgencyService = agencyService) {
    this.service = service;
  }

  async listExpertise(admin = false) {
    try {
      const data = admin
        ? await this.service.getExpertiseAll()
        : await this.service.getExpertisePublic();
      return NextResponse.json({ success: true, data });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load expertise";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  }

  async listTeam(admin = false) {
    try {
      const data = admin ? await this.service.getTeamAll() : await this.service.getTeamPublic();
      return NextResponse.json({ success: true, data });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load team";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  }

  async listWork(admin = false) {
    try {
      const data = admin ? await this.service.getWorkAll() : await this.service.getWorkPublic();
      return NextResponse.json({ success: true, data });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load work";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  }

  async createExpertise(req: Request) {
    try {
      const body = await req.json();
      const item = await this.service.createExpertise(body);
      return NextResponse.json({ success: true, data: item }, { status: 201 });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
  }

  async updateExpertise(req: Request, id: string) {
    try {
      const body = await req.json();
      const item = await this.service.updateExpertise(id, body);
      return NextResponse.json({ success: true, data: item });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
  }

  async deleteExpertise(id: string) {
    try {
      const item = await this.service.deleteExpertise(id);
      return NextResponse.json({ success: true, data: item });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
  }

  async createTeam(req: Request) {
    try {
      const body = await req.json();
      const item = await this.service.createTeam(body);
      return NextResponse.json({ success: true, data: item }, { status: 201 });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
  }

  async updateTeam(req: Request, id: string) {
    try {
      const body = await req.json();
      const item = await this.service.updateTeam(id, body);
      return NextResponse.json({ success: true, data: item });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
  }

  async deleteTeam(id: string) {
    try {
      const item = await this.service.deleteTeam(id);
      return NextResponse.json({ success: true, data: item });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
  }

  async createWork(req: Request) {
    try {
      const body = await req.json();
      const item = await this.service.createWork(body);
      return NextResponse.json({ success: true, data: item }, { status: 201 });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
  }

  async updateWork(req: Request, id: string) {
    try {
      const body = await req.json();
      const item = await this.service.updateWork(id, body);
      return NextResponse.json({ success: true, data: item });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
  }

  async deleteWork(id: string) {
    try {
      const item = await this.service.deleteWork(id);
      return NextResponse.json({ success: true, data: item });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
  }
}

export const agencyController = new AgencyController();
