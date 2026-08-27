import type { MetadataRoute } from "next";
import { SITE } from "@/constants";
import type { SitemapPathConfig } from "./types";
import { absoluteUrl, normalizeSitePath } from "./urls";

export type DynamicSitemapProvider = () => Promise<SitemapPathConfig[]>;

let dynamicSitemapProvider: DynamicSitemapProvider | null = null;

/**
 * Register template-specific dynamic routes (projects, rooms, blog posts, etc.).
 * Call from your template once, e.g. in app/sitemap.ts after importing this module.
 */
export function registerDynamicSitemapProvider(provider: DynamicSitemapProvider) {
  dynamicSitemapProvider = provider;
}

function toSitemapEntry(config: SitemapPathConfig): MetadataRoute.Sitemap[number] {
  const path = normalizeSitePath(config.path);
  return {
    url: absoluteUrl(path),
    lastModified: config.lastModified ?? new Date(),
    changeFrequency: config.changeFrequency ?? "weekly",
    priority: config.priority ?? (path === "/" ? 1 : 0.7),
  };
}

function moduleStaticPaths(): SitemapPathConfig[] {
  const paths: SitemapPathConfig[] = [...(SITE.seo.sitemap?.staticRoutes ?? [])];

  if (SITE.features.gallery) {
    paths.push({ path: "/gallery", changeFrequency: "weekly", priority: 0.75 });
  }

  if (SITE.features.legalPages) {
    paths.push(
      { path: SITE.legal.privacyPolicyPath, changeFrequency: "yearly", priority: 0.3 },
      { path: SITE.legal.termsPath, changeFrequency: "yearly", priority: 0.3 }
    );
  }

  return paths;
}

/**
 * Production sitemap builder — home route, module routes, SITE.seo.sitemap.staticRoutes,
 * and optional dynamic provider.
 */
export async function buildAppSitemap(): Promise<MetadataRoute.Sitemap> {
  const seen = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  const push = (config: SitemapPathConfig) => {
    const path = normalizeSitePath(config.path);
    if (seen.has(path)) return;
    seen.add(path);
    entries.push(toSitemapEntry({ ...config, path }));
  };

  push({ path: "/", changeFrequency: "daily", priority: 1 });

  for (const config of moduleStaticPaths()) {
    push(config);
  }

  if (dynamicSitemapProvider) {
    try {
      const dynamic = await dynamicSitemapProvider();
      for (const config of dynamic) {
        push(config);
      }
    } catch (error) {
      console.error("[sitemap] dynamic provider failed:", error);
    }
  }

  return entries;
}
