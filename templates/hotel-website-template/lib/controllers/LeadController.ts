import { NextResponse } from "next/server";
import { leadService, LeadService } from "../services/LeadService";

export class LeadController {
  private service: LeadService;

  constructor(service: LeadService = leadService) {
    this.service = service;
  }

  async getLeads(): Promise<NextResponse> {
    try {
      const list = await this.service.listLeads();
      return NextResponse.json({ success: true, data: list }, { status: 200 });
    } catch (error: any) {
      console.error("GET /api/leads error:", error);
      return NextResponse.json({ success: false, error: error.message || "Failed to fetch leads" }, { status: 500 });
    }
  }

  async createLead(req: Request): Promise<NextResponse> {
    try {
      const body = await req.json();
      
      const lead = await this.service.createLead({
        roomTypeName: body.roomTypeName || body.projectName || body.project || "",
        name: body.name,
        email: body.email,
        phone: body.phone,
        message: body.message,
      });

      return NextResponse.json({ success: true, data: lead }, { status: 201 });
    } catch (error: any) {
      console.error("POST /api/leads error:", error);
      return NextResponse.json({ success: false, error: error.message || "Failed to submit lead" }, { status: 400 });
    }
  }
}

export const leadController = new LeadController();
