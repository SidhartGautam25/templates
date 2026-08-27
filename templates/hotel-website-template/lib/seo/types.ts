/** JSON-LD @type values supported by buildOrganizationJsonLd */
export type SchemaOrgBusinessType =
  | "Organization"
  | "LocalBusiness"
  | "LodgingBusiness"
  | "Hotel"
  | "RealEstateAgent"
  | "Restaurant"
  | "Store";

export interface JsonLdObject {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
}

export interface SitemapPathConfig {
  path: string;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
  lastModified?: Date | string;
}

export interface PageMetadataInput {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}
