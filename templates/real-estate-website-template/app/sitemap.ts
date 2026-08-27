import type { MetadataRoute } from "next";
import "@/lib/real-estate/register-sitemap";
import { buildAppSitemap } from "@/lib/seo/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildAppSitemap();
}
