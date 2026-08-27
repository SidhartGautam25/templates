import type { MetadataRoute } from "next";
import { buildAppSitemap } from "@/lib/seo/sitemap";

/**
 * Dynamic sitemap.xml — extend with registerDynamicSitemapProvider() in a template bootstrap file.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildAppSitemap();
}
