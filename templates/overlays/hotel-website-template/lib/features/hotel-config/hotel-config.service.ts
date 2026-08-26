import { hotelConfigRepository, HotelConfigRepository } from "./hotel-config.repository";
import { HotelConfig } from "@prisma/client";
import { SITE } from "@/constants/site";

export class HotelConfigService {
  private repo: HotelConfigRepository;

  constructor(repo: HotelConfigRepository = hotelConfigRepository) {
    this.repo = repo;
  }

  async getConfig(): Promise<HotelConfig> {
    const config = await this.repo.get();
    if (!config) {
      return {
        id: "global",
        address: SITE.contact.address.full,
        templeDistance: SITE.contact.templeDistance,
        phone: SITE.contact.phoneDisplay,
        email: SITE.contact.email,
        updatedAt: new Date(),
      };
    }
    return config;
  }

  async updateConfig(data: {
    address: string;
    templeDistance: string;
    phone?: string | null;
    email?: string | null;
  }): Promise<HotelConfig> {
    return this.repo.update(data);
  }
}

export const hotelConfigService = new HotelConfigService();
