import { SITE } from "@/constants";
import type { JsonLdObject, SchemaOrgBusinessType } from "./types";
import { absoluteUrl } from "./urls";

/**
 * Safe JSON serialization for inline <script type="application/ld+json">.
 * Escapes characters that could break out of a script context.
 */
export function serializeJsonLd(data: JsonLdObject | JsonLdObject[]): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function businessType(): SchemaOrgBusinessType {
  const t = SITE.seo.schemaType;
  if (
    t === "Organization" ||
    t === "LocalBusiness" ||
    t === "LodgingBusiness" ||
    t === "Hotel" ||
    t === "RealEstateAgent" ||
    t === "Restaurant" ||
    t === "Store"
  ) {
    return t;
  }
  return "Organization";
}

/**
 * Primary business / organization entity for the site.
 */
export function buildOrganizationJsonLd(): JsonLdObject {
  const type = businessType();
  const logo = SITE.seo.openGraph?.image || SITE.assets.logoOfficial || SITE.assets.logo;

  const payload: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": type,
    name: SITE.brand.name,
    url: absoluteUrl(),
    description: SITE.seo.defaultDescription,
    logo: absoluteUrl(logo),
    image: absoluteUrl(logo),
    telephone: `+${SITE.contact.countryCode}${SITE.contact.phone}`,
    email: SITE.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.contact.address.full,
      addressLocality: SITE.contact.address.locality,
      addressRegion: SITE.contact.address.region,
      addressCountry: SITE.contact.address.country,
    },
  };

  if (SITE.seo.priceRange) {
    payload.priceRange = SITE.seo.priceRange;
  }

  if (SITE.seo.sameAs?.length) {
    payload.sameAs = SITE.seo.sameAs.filter(Boolean);
  }

  return payload;
}

/**
 * WebSite entity with optional SearchAction when search path is configured.
 */
export function buildWebSiteJsonLd(): JsonLdObject {
  const payload: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.brand.name,
    alternateName: SITE.brand.shortName,
    url: absoluteUrl(),
    description: SITE.seo.defaultDescription,
    inLanguage: SITE.seo.locale || "en",
    publisher: {
      "@type": "Organization",
      name: SITE.brand.developerName || SITE.brand.name,
      logo: absoluteUrl(SITE.assets.logo),
    },
  };

  const searchPath = SITE.seo.searchPath?.trim();
  if (searchPath) {
    payload.potentialAction = {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl(`${searchPath}?q={search_term_string}`),
      },
      "query-input": "required name=search_term_string",
    };
  }

  return payload;
}

/**
 * BreadcrumbList for detail pages.
 */
export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[]
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * Default graph injected on every page (Organization + WebSite).
 */
export function buildDefaultJsonLdGraph(): JsonLdObject[] {
  return [buildOrganizationJsonLd(), buildWebSiteJsonLd()];
}
