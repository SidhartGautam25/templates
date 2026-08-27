import { registerDynamicSitemapProvider } from "@/lib/seo/sitemap";
import type { SitemapPathConfig } from "@/lib/seo/types";
import { defaultRoomTypes } from "@/constants/default-room-types";
import { roomTypeService } from "@/lib/features/room-types";
import { slugify } from "@/lib/utils/slugify";

registerDynamicSitemapProvider(async (): Promise<SitemapPathConfig[]> => {
  const routes: SitemapPathConfig[] = [];
  const processedSlugs = new Set<string>();

  const addRoom = (name: string, id: string) => {
    const slug = slugify(name) || id;
    if (!slug || processedSlugs.has(slug)) return;
    processedSlugs.add(slug);
    routes.push({
      path: `/${slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  };

  try {
    const dbRooms = await roomTypeService.listRoomTypes();
    for (const room of dbRooms) {
      addRoom(room.name, room.id);
    }
  } catch (error) {
    console.error("[sitemap] failed to list room types:", error);
  }

  for (const room of defaultRoomTypes) {
    addRoom(room.name, room.id);
  }

  return routes;
});
