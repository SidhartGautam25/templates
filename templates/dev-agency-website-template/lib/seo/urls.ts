import { SITE } from "@/constants";

/**
 * Absolute site URL with no trailing slash on the origin.
 */
export function getCanonicalOrigin(): string {
  return SITE.domain.baseUrl.replace(/\/$/, "");
}

/**
 * Build absolute URL for a site path (leading slash optional).
 */
export function absoluteUrl(path = ""): string {
  const origin = getCanonicalOrigin();
  if (!path) return origin;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalized}`;
}

/**
 * Normalize path for sitemap entries (always leading slash, no trailing slash except root).
 */
export function normalizeSitePath(path: string): string {
  if (!path || path === "/") return "/";
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  return withSlash.replace(/\/+$/, "") || "/";
}
