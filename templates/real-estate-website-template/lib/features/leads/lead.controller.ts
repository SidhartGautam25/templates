import { NextResponse } from "next/server";
import { leadService, LeadService } from "./lead.service";
import { normalizeLeadPayload } from "./lead.types";

export class LeadController {
  private service: LeadService;

  constructor(service: LeadService = leadService) {
    this.service = service;
  }

  async getLeads(): Promise<NextResponse> {
    try {
      const list = await this.service.listLeads();
      return NextResponse.json({ success: true, data: list }, { status: 200 });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch leads";
      console.error("GET /api/leads error:", error);
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  }

  async createLead(req: Request): Promise<NextResponse> {
    try {
      const body = await req.json();
      const lead = await this.service.createLead(normalizeLeadPayload(body));

      return NextResponse.json({ success: true, data: lead }, { status: 201 });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to submit lead";
      console.error("POST /api/leads error:", error);
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
  }
}

export const leadController = new LeadController();
