import type { MetadataRoute } from "next";
import "@/lib/hotel/register-sitemap";
import { buildAppSitemap } from "@/lib/seo/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildAppSitemap();
}
