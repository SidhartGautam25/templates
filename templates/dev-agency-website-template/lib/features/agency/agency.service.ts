import type { AgencyExpertise, AgencyFeaturedWork, AgencyTeamMember } from "@prisma/client";
import {
  agencyRepository,
  AgencyRepository,
  defaultExpertiseRows,
  defaultTeamRows,
  defaultWorkRows,
  type ExpertiseInput,
  type TeamInput,
  type WorkInput,
} from "./agency.repository";

export class AgencyService {
  private repo: AgencyRepository;

  constructor(repo: AgencyRepository = agencyRepository) {
    this.repo = repo;
  }

  async getExpertisePublic(): Promise<AgencyExpertise[]> {
    const rows = await this.repo.listExpertise(true);
    return rows.length > 0 ? rows : defaultExpertiseRows();
  }

  async getExpertiseAll(): Promise<AgencyExpertise[]> {
    const rows = await this.repo.listExpertise(false);
    return rows.length > 0 ? rows : defaultExpertiseRows();
  }

  async getTeamPublic(): Promise<AgencyTeamMember[]> {
    const rows = await this.repo.listTeam(true);
    return rows.length > 0 ? rows : defaultTeamRows();
  }

  async getTeamAll(): Promise<AgencyTeamMember[]> {
    const rows = await this.repo.listTeam(false);
    return rows.length > 0 ? rows : defaultTeamRows();
  }

  async getWorkPublic(): Promise<AgencyFeaturedWork[]> {
    const rows = await this.repo.listWork(true);
    return rows.length > 0 ? rows : defaultWorkRows();
  }

  async getWorkAll(): Promise<AgencyFeaturedWork[]> {
    const rows = await this.repo.listWork(false);
    return rows.length > 0 ? rows : defaultWorkRows();
  }

  createExpertise(data: ExpertiseInput) {
    if (!data.title?.trim()) throw new Error("Title is required.");
    return this.repo.createExpertise(data);
  }

  updateExpertise(id: string, data: Partial<ExpertiseInput>) {
    if (id.startsWith("default-")) throw new Error("Cannot edit seed data — add a new row in admin.");
    return this.repo.updateExpertise(id, data);
  }

  deleteExpertise(id: string) {
    if (id.startsWith("default-")) throw new Error("Cannot delete seed data.");
    return this.repo.deleteExpertise(id);
  }

  createTeam(data: TeamInput) {
    if (!data.name?.trim()) throw new Error("Name is required.");
    return this.repo.createTeam(data);
  }

  updateTeam(id: string, data: Partial<TeamInput>) {
    if (id.startsWith("default-")) throw new Error("Cannot edit seed data — add a new row in admin.");
    return this.repo.updateTeam(id, data);
  }

  deleteTeam(id: string) {
    if (id.startsWith("default-")) throw new Error("Cannot delete seed data.");
    return this.repo.deleteTeam(id);
  }

  createWork(data: WorkInput) {
    if (!data.clientName?.trim() || !data.websiteUrl?.trim()) {
      throw new Error("Client name and website URL are required.");
    }
    return this.repo.createWork(data);
  }

  updateWork(id: string, data: Partial<WorkInput>) {
    if (id.startsWith("default-")) throw new Error("Cannot edit seed data — add a new row in admin.");
    return this.repo.updateWork(id, data);
  }

  deleteWork(id: string) {
    if (id.startsWith("default-")) throw new Error("Cannot delete seed data.");
    return this.repo.deleteWork(id);
  }
}

export const agencyService = new AgencyService();
