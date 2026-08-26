/**
 * Per-template init field registry and flag resolution.
 * Maintainers: add fields here once, then reference keys in templates.json `init.brandFields`.
 */

/** @typedef {{
 *   flag: string,
 *   cliKey: string,
 *   prompt: string,
 *   description: string,
 *   siteKey?: string,
 *   example?: string
 * }} InitFieldDef */

/** @typedef {{
 *   flagGroups?: string[],
 *   brandFields?: string[],
 *   skipBrand?: boolean,
 *   skipDatabase?: boolean
 * }} TemplateInitConfig */

export const DEFAULT_FLAG_GROUPS = ["generate", "theme", "brand", "database"];

export const DEFAULT_BRAND_FIELDS = [
  "name",
  "shortName",
  "baseUrl",
  "phone",
  "phoneDisplay",
  "countryCode",
  "email",
  "address",
];

/**
 * All supported brand/init fields. Keys match templates.json `init.brandFields` entries.
 * @type {Record<string, InitFieldDef>}
 */
export const INIT_FIELD_REGISTRY = {
  name: {
    flag: "--name",
    cliKey: "name",
    prompt: "Brand Name",
    description: "Primary business name shown across the site",
    siteKey: "brandName",
    example: "--name \"Lakeside Haven Resort\"",
  },
  shortName: {
    flag: "--short-name",
    cliKey: "shortName",
    prompt: "Short/Display Name",
    description: "Compact label for headers and compact UI",
    example: "--short-name \"Lakeside Haven\"",
  },
  baseUrl: {
    flag: "--base-url",
    cliKey: "baseUrl",
    prompt: "Base URL",
    description: "Production site URL (SEO, sitemap, canonical links)",
    example: "--base-url https://lakesidehaven.com",
  },
  phone: {
    flag: "--phone",
    cliKey: "phone",
    prompt: "Contact Phone Number",
    description: "Raw phone digits without spaces",
    example: "--phone 9876543210",
  },
  phoneDisplay: {
    flag: "--phone-display",
    cliKey: "phoneDisplay",
    prompt: "Display Phone Number",
    description: "Formatted phone for display in UI",
    example: "--phone-display \"+91 98765 43210\"",
  },
  countryCode: {
    flag: "--country-code",
    cliKey: "countryCode",
    prompt: "Country Code",
    description: "Phone country code (no plus sign)",
    example: "--country-code 91",
  },
  email: {
    flag: "--email",
    cliKey: "email",
    prompt: "Contact Email",
    description: "Public contact email",
    example: "--email reservations@example.com",
  },
  address: {
    flag: "--address",
    cliKey: "address",
    prompt: "Full Address",
    description: "Full address string (locality and region are derived for structured fields)",
    example: "--address \"Lonavala, Maharashtra, India\"",
  },
  tagline: {
    flag: "--tagline",
    cliKey: "tagline",
    prompt: "Tagline",
    description: "Short brand tagline under the logo",
    example: "--tagline \"Where Nature Meets Refined Comfort\"",
  },
  developerName: {
    flag: "--developer-name",
    cliKey: "developerName",
    prompt: "Developer / Company Name",
    description: "Legal or developer entity name (real estate) or resort operator name",
    example: "--developer-name \"Greenfield Properties\"",
  },
  channelPartner: {
    flag: "--channel-partner",
    cliKey: "channelPartner",
    prompt: "Channel Partner Name",
    description: "Sales or hospitality partner label used in consent text",
    example: "--channel-partner \"Greenfield Realty Partners\"",
  },
  agentRera: {
    flag: "--agent-rera",
    cliKey: "agentRera",
    prompt: "Agent RERA Number",
    description: "RERA registration for real-estate agent/consent (legal.agentRera)",
    example: "--agent-rera A52100012345",
  },
  templeDistance: {
    flag: "--temple-distance",
    cliKey: "templeDistance",
    prompt: "Nearby Landmark Distance",
    description: "Hotel-specific nearby landmark line (contact.templeDistance)",
    example: "--temple-distance \"5 min walk to Lonavala Lake viewpoint\"",
  },
  company: {
    flag: "--company",
    cliKey: "company",
    prompt: "Company Name",
    description: "Alias for developer/company name when templates use company branding",
    siteKey: "developerName",
    example: "--company \"Mi Plaza Hospitality\"",
  },
  location: {
    flag: "--location",
    cliKey: "location",
    prompt: "Primary Location",
    description: "City or locality label (updates address locality when full address is not set)",
    example: "--location \"Lonavala\"",
  },
};

/**
 * @param {import('./config.js').TemplateEntry} entry
 * @returns {TemplateInitConfig}
 */
export function resolveTemplateInitConfig(entry) {
  const init = entry.init ?? {};
  return {
    flagGroups: init.flagGroups ?? DEFAULT_FLAG_GROUPS,
    brandFields: init.brandFields ?? DEFAULT_BRAND_FIELDS,
    skipBrand: init.skipBrand ?? false,
    skipDatabase: init.skipDatabase ?? false,
  };
}

/**
 * @param {import('./config.js').TemplateEntry} entry
 * @returns {InitFieldDef[]}
 */
export function getTemplateBrandFields(entry) {
  const { brandFields } = resolveTemplateInitConfig(entry);
  return brandFields
    .map((key) => INIT_FIELD_REGISTRY[key])
    .filter(Boolean);
}

/**
 * @param {string} templateId
 * @param {import('./config.js').TemplateEntry} entry
 * @param {Record<string, string | undefined>} options
 */
export function pickBrandOptionsForTemplate(templateId, entry, options) {
  const { brandFields, skipBrand } = resolveTemplateInitConfig(entry);
  if (skipBrand) return {};

  const picked = { yes: options.yes };

  for (const fieldKey of brandFields) {
    const def = INIT_FIELD_REGISTRY[fieldKey];
    if (!def) continue;

    const value = options[def.cliKey];
    if (value !== undefined && value !== "") {
      picked[def.cliKey] = value;
    }
  }

  // company flag maps to developerName in brand-manager
  if (options.company && !picked.developerName) {
    picked.developerName = options.company;
  }

  return picked;
}

/**
 * @param {import('./config.js').TemplateEntry} entry
 * @returns {string[]}
 */
export function getTemplateFlagGroups(entry) {
  return resolveTemplateInitConfig(entry).flagGroups;
}
