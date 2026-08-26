import type { MetadataRoute } from "next";
import { defaultRoomTypes } from "@/constants/default-room-types";
import { roomTypeService } from "@/lib/features/room-types";
import { slugify } from "@/lib/utils/slugify";
import { SITE } from "@/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE.domain.baseUrl;

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  let dbRooms: any[] = [];
  try {
    dbRooms = await roomTypeService.listRoomTypes();
  } catch (err) {
    console.error("Failed to list room types for sitemap:", err);
  }

  const processedSlugs = new Set<string>();

  const addRoomUrl = (name: string, id: string) => {
    const slug = slugify(name) || id;
    if (slug && !processedSlugs.has(slug)) {
      processedSlugs.add(slug);
      routes.push({
        url: `${baseUrl}/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  };

  for (const room of dbRooms) {
    addRoomUrl(room.name, room.id);
  }

  for (const room of defaultRoomTypes) {
    addRoomUrl(room.name, room.id);
  }

  return routes;
}
