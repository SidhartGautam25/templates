import { prisma } from "../db";
import { HotelConfig } from "@prisma/client";

export class HotelConfigRepository {
  async get(): Promise<HotelConfig | null> {
    return prisma.hotelConfig.findUnique({
      where: { id: "global" },
    });
  }

  async update(data: {
    address: string;
    templeDistance: string;
    phone?: string | null;
    email?: string | null;
  }): Promise<HotelConfig> {
    return prisma.hotelConfig.upsert({
      where: { id: "global" },
      update: data,
      create: {
        id: "global",
        ...data,
      },
    });
  }
}

export const hotelConfigRepository = new HotelConfigRepository();
