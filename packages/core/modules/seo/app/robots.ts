import type { MetadataRoute } from "next";
import { SITE } from "@/constants";
import { absoluteUrl } from "@/lib/seo/urls";

/**
 * Production robots.txt — blocks admin, API, and optional paths from SITE.seo.robots.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = [
    "/admin/",
    "/api/",
    ...(SITE.seo.robots?.disallow ?? []),
  ].filter(Boolean);

  const allow = SITE.seo.robots?.allow ?? ["/"];

  const rules: MetadataRoute.Robots["rules"] = {
    userAgent: "*",
    allow,
    disallow,
  };

  const host = absoluteUrl().replace(/^https?:\/\//, "");

  return {
    rules,
    sitemap: absoluteUrl("/sitemap.xml"),
    host,
  };
}
