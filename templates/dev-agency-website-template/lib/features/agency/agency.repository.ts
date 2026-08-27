import type { AgencyExpertise, AgencyFeaturedWork, AgencyTeamMember } from "@prisma/client";
import { prisma } from "@/lib/database/prisma";
import {
  DEFAULT_AGENCY_EXPERTISE,
  DEFAULT_AGENCY_TEAM,
  DEFAULT_AGENCY_WORK,
} from "@/constants/default-agency-data";

export type ExpertiseInput = {
  title: string;
  description: string;
  iconKey?: string;
  sortOrder?: number;
  published?: boolean;
};

export type TeamInput = {
  name: string;
  role: string;
  avatarColor?: string;
  sortOrder?: number;
  published?: boolean;
};

export type WorkInput = {
  clientName: string;
  websiteUrl: string;
  category?: string;
  review?: string | null;
  logoUrl?: string | null;
  gradient?: string;
  sortOrder?: number;
  published?: boolean;
};

export class AgencyRepository {
  async listExpertise(publishedOnly = true): Promise<AgencyExpertise[]> {
    const rows = await prisma.agencyExpertise.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return rows;
  }

  async listTeam(publishedOnly = true): Promise<AgencyTeamMember[]> {
    return prisma.agencyTeamMember.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  }

  async listWork(publishedOnly = true): Promise<AgencyFeaturedWork[]> {
    return prisma.agencyFeaturedWork.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  }

  async createExpertise(data: ExpertiseInput) {
    return prisma.agencyExpertise.create({ data });
  }

  async updateExpertise(id: string, data: Partial<ExpertiseInput>) {
    return prisma.agencyExpertise.update({ where: { id }, data });
  }

  async deleteExpertise(id: string) {
    return prisma.agencyExpertise.delete({ where: { id } });
  }

  async createTeam(data: TeamInput) {
    return prisma.agencyTeamMember.create({ data });
  }

  async updateTeam(id: string, data: Partial<TeamInput>) {
    return prisma.agencyTeamMember.update({ where: { id }, data });
  }

  async deleteTeam(id: string) {
    return prisma.agencyTeamMember.delete({ where: { id } });
  }

  async createWork(data: WorkInput) {
    return prisma.agencyFeaturedWork.create({ data });
  }

  async updateWork(id: string, data: Partial<WorkInput>) {
    return prisma.agencyFeaturedWork.update({ where: { id }, data });
  }

  async deleteWork(id: string) {
    return prisma.agencyFeaturedWork.delete({ where: { id } });
  }
}

export const agencyRepository = new AgencyRepository();

export function defaultExpertiseRows(): AgencyExpertise[] {
  return DEFAULT_AGENCY_EXPERTISE.map((row, i) => ({
    id: `default-expertise-${i}`,
    title: row.title,
    description: row.description,
    iconKey: row.iconKey,
    sortOrder: i,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

export function defaultTeamRows(): AgencyTeamMember[] {
  return DEFAULT_AGENCY_TEAM.map((row, i) => ({
    id: `default-team-${i}`,
    name: row.name,
    role: row.role,
    avatarColor: row.avatarColor,
    sortOrder: i,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

export function defaultWorkRows(): AgencyFeaturedWork[] {
  return DEFAULT_AGENCY_WORK.map((row, i) => ({
    id: `default-work-${i}`,
    clientName: row.clientName,
    websiteUrl: row.websiteUrl,
    category: row.category,
    review: row.review,
    logoUrl: null,
    gradient: row.gradient,
    sortOrder: i,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}
