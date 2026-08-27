import type { Lead } from "@prisma/client";
import { leadRepository, LeadRepository } from "./lead.repository";
import type { CreateLeadInput } from "./lead.types";

export class LeadService {
  private repo: LeadRepository;

  constructor(repo: LeadRepository = leadRepository) {
    this.repo = repo;
  }

  async listLeads(): Promise<Lead[]> {
    return this.repo.getAll();
  }

  async createLead(data: CreateLeadInput): Promise<Lead> {
    if (!data.name.trim()) throw new Error("Name is required.");
    if (!data.phone.trim()) throw new Error("Phone number is required.");
    if (!data.projectName.trim()) {
      throw new Error("Project or room selection is required.");
    }

    if (data.email?.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error("Please enter a valid email address.");
      }
    }

    const cleanPhone = data.phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      throw new Error("Please enter a valid 10-digit mobile number.");
    }

    return this.repo.create({
      ...data,
      phone: cleanPhone,
    });
  }
}

export const leadService = new LeadService();
