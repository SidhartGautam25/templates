import { prisma } from "../db";
import { Lead } from "@prisma/client";

export class LeadRepository {
  async getAll(): Promise<Lead[]> {
    return prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: {
    projectName: string;
    name: string;
    email: string;
    phone: string;
    message?: string | null;
  }): Promise<Lead> {
    return prisma.lead.create({
      data: {
        projectName: data.projectName,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message || null,
      },
    });
  }
}

export const leadRepository = new LeadRepository();
