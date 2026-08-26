import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { readFile, writeFile } from "node:fs/promises";
import { findSiteTs } from "./theme-manager.js";
import {
  INIT_FIELD_REGISTRY,
  getTemplateBrandFields,
  pickBrandOptionsForTemplate,
} from "./init-options.js";
import { loadManifest } from "./config.js";

/**
 * @typedef {{
 *   yes?: boolean,
 *   name?: string,
 *   shortName?: string,
 *   baseUrl?: string,
 *   phone?: string,
 *   phoneDisplay?: string,
 *   countryCode?: string,
 *   email?: string,
 *   address?: string,
 *   tagline?: string,
 *   developerName?: string,
 *   channelPartner?: string,
 *   agentRera?: string,
 *   templeDistance?: string,
 *   company?: string,
 *   location?: string
 * }} BrandOptions
 */

/**
 * @param {string} siteContent
 */
function parseCurrentBrandValues(siteContent) {
  const match = (pattern, fallback = "") => {
    const result = siteContent.match(pattern);
    return result?.[1] ?? fallback;
  };

  return {
    brandName: match(/name:\s*"([^"]+)"/, "Demo Client Site"),
    shortName: match(/shortName:\s*"([^"]+)"/, "Demo"),
    baseUrl: match(/baseUrl:\s*"([^"]+)"/, "https://example.com"),
    phone: match(/phone:\s*"([^"]+)"/, "9876543210"),
    phoneDisplay: match(/phoneDisplay:\s*"([^"]+)"/, "+91 98765 43210"),
    countryCode: match(/countryCode:\s*"([^"]+)"/, "91"),
    email: match(/email:\s*"([^"]+)"/, "hello@example.com"),
    address: match(/full:\s*"([^"]+)"/, "Lonavala, Maharashtra, India"),
    tagline: match(/tagline:\s*"([^"]+)"/, ""),
    developerName: match(/developerName:\s*"([^"]+)"/, ""),
    channelPartner: match(/channelPartner:\s*"([^"]+)"/, ""),
    agentRera: match(/agentRera:\s*"([^"]*)"/, ""),
    templeDistance: match(/templeDistance:\s*"([^"]*)"/, ""),
    locality: match(/locality:\s*"([^"]+)"/, "Lonavala"),
  };
}

/**
 * @param {string} baseUrl
 */
function deriveWwwHost(baseUrl) {
  try {
    const url = new URL(baseUrl);
    return url.hostname.startsWith("www.") ? url.hostname : `www.${url.hostname}`;
  } catch {
    let wwwHost = baseUrl.replace(/^https?:\/\//, "");
    if (!wwwHost.startsWith("www.")) wwwHost = `www.${wwwHost}`;
    return wwwHost;
  }
}

/**
 * @param {string} value
 */
function escapeForTsString(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/**
 * @param {string} siteContent
 * @param {ReturnType<typeof parseCurrentBrandValues>} current
 * @param {BrandOptions} options
 */
function buildBrandValues(current, options) {
  const brandName = options.name?.trim() || current.brandName;
  const developerName =
    options.developerName?.trim() || options.company?.trim() || current.developerName || brandName;

  let address = options.address?.trim() || current.address;
  let locality = current.locality;

  if (options.location?.trim() && !options.address?.trim()) {
    locality = options.location.trim();
    const parts = address.split(",");
    if (parts.length >= 2) {
      address = `${locality}, ${parts.slice(1).join(",").trim()}`;
    } else {
      address = locality;
    }
  }

  const addressParts = address.split(",");
  if (addressParts.length >= 2) {
    locality = addressParts[0].trim();
  }

  return {
    brandName,
    shortName: options.shortName?.trim() || current.shortName,
    baseUrl: options.baseUrl?.trim() || current.baseUrl,
    phone: options.phone?.trim() || current.phone,
    phoneDisplay: options.phoneDisplay?.trim() || current.phoneDisplay,
    countryCode: options.countryCode?.trim() || current.countryCode,
    email: options.email?.trim() || current.email,
    address,
    locality,
    region: addressParts.length >= 2 ? addressParts[1].trim() : "MH",
    tagline: options.tagline?.trim() || current.tagline,
    developerName,
    channelPartner: options.channelPartner?.trim() || current.channelPartner || `${brandName} Partner`,
    agentRera: options.agentRera?.trim() ?? current.agentRera,
    templeDistance: options.templeDistance?.trim() ?? current.templeDistance,
  };
}

/**
 * @param {string} siteContent
 * @param {ReturnType<typeof buildBrandValues>} values
 */
function applyBrandToSiteContent(siteContent, values) {
  const wwwHost = deriveWwwHost(values.baseUrl);

  const newBrandBlock = `brand: {
    name: "${escapeForTsString(values.brandName)}",
    shortName: "${escapeForTsString(values.shortName)}",
    tagline: "${escapeForTsString(values.tagline)}",
    developerName: "${escapeForTsString(values.developerName)}",
    channelPartner: "${escapeForTsString(values.channelPartner)}",
    copyright: "${escapeForTsString(values.brandName)}. All Rights Reserved.",
    managedBy: "Managed by ${escapeForTsString(values.developerName)}.",
  }`;

  const newDomainBlock = `domain: {
    baseUrl: "${escapeForTsString(values.baseUrl)}",
    wwwHost: "${escapeForTsString(wwwHost)}",
  }`;

  const templeLine = values.templeDistance
    ? `\n    templeDistance: "${escapeForTsString(values.templeDistance)}",`
    : "";

  const newContactBlock = `contact: {
    phone: "${escapeForTsString(values.phone)}",
    phoneDisplay: "${escapeForTsString(values.phoneDisplay)}",
    countryCode: "${escapeForTsString(values.countryCode)}",
    email: "${escapeForTsString(values.email)}",
    address: {
      locality: "${escapeForTsString(values.locality)}",
      region: "${escapeForTsString(values.region)}",
      country: "IN",
      full: "${escapeForTsString(values.address)}",
    },${templeLine}
  }`;

  const brandRegex = /brand:\s*\{[\s\S]*?\n\s*\},/;
  const domainRegex = /domain:\s*\{[\s\S]*?\n\s*\},/;
  const contactRegex = /contact:\s*\{[\s\S]*?address:\s*\{[\s\S]*?\}[\s\S]*?\n\s*\},/;
  const agentReraRegex = /agentRera:\s*"[^"]*"/;

  if (brandRegex.test(siteContent)) {
    siteContent = siteContent.replace(brandRegex, newBrandBlock + ",");
  }
  if (domainRegex.test(siteContent)) {
    siteContent = siteContent.replace(domainRegex, newDomainBlock + ",");
  }
  if (contactRegex.test(siteContent)) {
    siteContent = siteContent.replace(contactRegex, newContactBlock + ",");
  }
  if (agentReraRegex.test(siteContent)) {
    siteContent = siteContent.replace(
      agentReraRegex,
      `agentRera: "${escapeForTsString(values.agentRera)}"`
    );
  }

  return siteContent;
}

/**
 * @param {ReturnType<typeof parseCurrentBrandValues>} current
 * @param {string} fieldKey
 */
function currentValueForField(current, fieldKey) {
  const def = INIT_FIELD_REGISTRY[fieldKey];
  if (!def) return "";

  switch (fieldKey) {
    case "name":
      return current.brandName;
    case "shortName":
      return current.shortName;
    case "baseUrl":
      return current.baseUrl;
    case "phone":
      return current.phone;
    case "phoneDisplay":
      return current.phoneDisplay;
    case "countryCode":
      return current.countryCode;
    case "email":
      return current.email;
    case "address":
      return current.address;
    case "tagline":
      return current.tagline;
    case "developerName":
    case "company":
      return current.developerName;
    case "channelPartner":
      return current.channelPartner;
    case "agentRera":
      return current.agentRera;
    case "templeDistance":
      return current.templeDistance;
    case "location":
      return current.locality;
    default:
      return "";
  }
}

/**
 * @param {string} targetDir
 * @param {BrandOptions} options
 * @param {string} [templateId]
 */
export async function applyBrand(targetDir, options = {}, templateId) {
  const siteTsPath = await findSiteTs(targetDir);
  if (!siteTsPath) {
    throw new Error(
      "Could not locate constants/site.ts. Make sure you are inside an initialized tempjs template directory."
    );
  }

  let siteContent = await readFile(siteTsPath, "utf8");
  const current = parseCurrentBrandValues(siteContent);
  const values = buildBrandValues(current, options);
  siteContent = applyBrandToSiteContent(siteContent, values);
  await writeFile(siteTsPath, siteContent, "utf8");
  console.log("Successfully updated brand and contact configurations in constants/site.ts.");
}

/**
 * @param {string} targetDir
 * @param {BrandOptions} options
 * @param {string} [templateId]
 */
export async function promptAndApplyBrand(targetDir, options = {}, templateId) {
  const manifest = loadManifest();
  const entry = templateId ? manifest.templates[templateId] : undefined;
  const fieldKeys = entry?.init?.brandFields ?? Object.keys(INIT_FIELD_REGISTRY);

  if (options.yes) {
    const picked = entry
      ? pickBrandOptionsForTemplate(templateId, entry, options)
      : options;
    await applyBrand(targetDir, picked, templateId);
    return;
  }

  const siteTsPath = await findSiteTs(targetDir);
  if (!siteTsPath) {
    console.error(
      "Error: Could not locate constants/site.ts. Make sure you are inside an initialized tempjs template directory."
    );
    return;
  }

  let siteContent = await readFile(siteTsPath, "utf8");
  const current = parseCurrentBrandValues(siteContent);
  const collected = { ...options };

  const rl = createInterface({ input, output });
  try {
    console.log("\n--- Configure Brand & Contact Details ---");

    for (const fieldKey of fieldKeys) {
      const field = INIT_FIELD_REGISTRY[fieldKey];
      if (!field) continue;

      const currentVal = currentValueForField(current, fieldKey);
      const answer = (await rl.question(`${field.prompt} [${currentVal}]: `)).trim();
      if (answer) {
        collected[field.cliKey] = answer;
      }
    }

    const values = buildBrandValues(current, collected);
    siteContent = applyBrandToSiteContent(siteContent, values);
    await writeFile(siteTsPath, siteContent, "utf8");
    console.log("Successfully updated brand and contact configurations in constants/site.ts.");
  } finally {
    rl.close();
  }
}
