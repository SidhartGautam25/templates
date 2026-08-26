import { prisma } from "@/lib/database/prisma";
import type { Lead } from "@prisma/client";
import type { CreateLeadInput } from "./lead.types";

export class LeadRepository {
  async getAll(): Promise<Lead[]> {
    return prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: CreateLeadInput): Promise<Lead> {
    return prisma.lead.create({
      data: {
        projectName: data.projectName,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message ?? null,
      },
    });
  }
}

export const leadRepository = new LeadRepository();
