import { buildDefaultJsonLdGraph, serializeJsonLd } from "@/lib/seo/json-ld";

/**
 * Injects default Organization + WebSite JSON-LD on every page.
 * Add to app/layout.tsx inside <body>.
 */
export default function SiteJsonLd() {
  const graph = buildDefaultJsonLdGraph();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(graph) }}
    />
  );
}
