import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { readFile, writeFile } from "node:fs/promises";
import { findSiteTs } from "./theme-manager.js";

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
 *   address?: string
 * }} BrandOptions
 */

/**
 * @param {string} siteContent
 */
function parseCurrentBrandValues(siteContent) {
  return {
    brandName: (siteContent.match(/name:\s*"([^"]+)"/) || [])[1] || "Demo Client Site",
    shortName: (siteContent.match(/shortName:\s*"([^"]+)"/) || [])[1] || "Demo",
    baseUrl: (siteContent.match(/baseUrl:\s*"([^"]+)"/) || [])[1] || "https://example.com",
    phone: (siteContent.match(/phone:\s*"([^"]+)"/) || [])[1] || "9876543210",
    phoneDisplay: (siteContent.match(/phoneDisplay:\s*"([^"]+)"/) || [])[1] || "+91 98765 43210",
    countryCode: (siteContent.match(/countryCode:\s*"([^"]+)"/) || [])[1] || "91",
    email: (siteContent.match(/email:\s*"([^"]+)"/) || [])[1] || "hello@example.com",
    address: (siteContent.match(/full:\s*"([^"]+)"/) || [])[1] || "Lonavala, Maharashtra, India",
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
 * @param {string} siteContent
 * @param {{
 *   brandName: string,
 *   shortName: string,
 *   baseUrl: string,
 *   phone: string,
 *   phoneDisplay: string,
 *   countryCode: string,
 *   email: string,
 *   address: string
 * }} values
 */
function applyBrandToSiteContent(siteContent, values) {
  const {
    brandName,
    shortName,
    baseUrl,
    phone,
    phoneDisplay,
    countryCode,
    email,
    address,
  } = values;

  const wwwHost = deriveWwwHost(baseUrl);

  const newBrandBlock = `brand: {
    name: "${brandName}",
    shortName: "${shortName}",
    tagline: "Where Nature Meets Refined Comfort",
    developerName: "${brandName}",
    channelPartner: "${brandName} Partner",
    copyright: "${brandName}. All Rights Reserved.",
    managedBy: "Managed by ${brandName}.",
  }`;

  const newDomainBlock = `domain: {
    baseUrl: "${baseUrl}",
    wwwHost: "${wwwHost}",
  }`;

  let locality = "Lonavala";
  let region = "MH";
  const addressParts = address.split(",");
  if (addressParts.length >= 2) {
    locality = addressParts[0].trim();
    region = addressParts[1].trim();
  }

  const newContactBlock = `contact: {
    phone: "${phone}",
    phoneDisplay: "${phoneDisplay}",
    countryCode: "${countryCode}",
    email: "${email}",
    address: {
      locality: "${locality}",
      region: "${region}",
      country: "IN",
      full: "${address}",
    },
  }`;

  const brandRegex = /brand:\s*\{[\s\S]*?\n\s*\},/;
  const domainRegex = /domain:\s*\{[\s\S]*?\n\s*\},/;
  const contactRegex = /contact:\s*\{[\s\S]*?address:\s*\{[\s\S]*?\}[\s\S]*?\n\s*\},/;

  if (brandRegex.test(siteContent)) {
    siteContent = siteContent.replace(brandRegex, newBrandBlock + ",");
  }
  if (domainRegex.test(siteContent)) {
    siteContent = siteContent.replace(domainRegex, newDomainBlock + ",");
  }
  if (contactRegex.test(siteContent)) {
    siteContent = siteContent.replace(contactRegex, newContactBlock + ",");
  }

  return siteContent;
}

/**
 * @param {string} targetDir
 * @param {BrandOptions} options
 */
export async function applyBrand(targetDir, options = {}) {
  const siteTsPath = await findSiteTs(targetDir);
  if (!siteTsPath) {
    throw new Error(
      "Could not locate constants/site.ts. Make sure you are inside an initialized tempjs template directory."
    );
  }

  let siteContent = await readFile(siteTsPath, "utf8");
  const current = parseCurrentBrandValues(siteContent);

  const values = {
    brandName: options.name?.trim() || current.brandName,
    shortName: options.shortName?.trim() || current.shortName,
    baseUrl: options.baseUrl?.trim() || current.baseUrl,
    phone: options.phone?.trim() || current.phone,
    phoneDisplay: options.phoneDisplay?.trim() || current.phoneDisplay,
    countryCode: options.countryCode?.trim() || current.countryCode,
    email: options.email?.trim() || current.email,
    address: options.address?.trim() || current.address,
  };

  siteContent = applyBrandToSiteContent(siteContent, values);
  await writeFile(siteTsPath, siteContent, "utf8");
  console.log("Successfully updated brand and contact configurations in constants/site.ts.");
}

/**
 * @param {string} targetDir
 * @param {BrandOptions} options
 */
export async function promptAndApplyBrand(targetDir, options = {}) {
  if (options.yes) {
    await applyBrand(targetDir, options);
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

  const rl = createInterface({ input, output });
  try {
    console.log("\n--- Configure Brand & Contact Details ---");

    const brandName =
      (await rl.question(`Brand Name [${current.brandName}]: `)).trim() || current.brandName;
    const shortName =
      (await rl.question(`Short/Display Name [${current.shortName}]: `)).trim() || current.shortName;
    const baseUrl =
      (await rl.question(`Base URL [${current.baseUrl}]: `)).trim() || current.baseUrl;
    const phone =
      (await rl.question(`Contact Phone Number [${current.phone}]: `)).trim() || current.phone;
    const phoneDisplay =
      (await rl.question(`Display Phone Number [${current.phoneDisplay}]: `)).trim() ||
      current.phoneDisplay;
    const countryCode =
      (await rl.question(`Country Code [${current.countryCode}]: `)).trim() || current.countryCode;
    const email =
      (await rl.question(`Contact Email [${current.email}]: `)).trim() || current.email;
    const address =
      (await rl.question(`Full Address [${current.address}]: `)).trim() || current.address;

    siteContent = applyBrandToSiteContent(siteContent, {
      brandName,
      shortName,
      baseUrl,
      phone,
      phoneDisplay,
      countryCode,
      email,
      address,
    });

    await writeFile(siteTsPath, siteContent, "utf8");
    console.log("Successfully updated brand and contact configurations in constants/site.ts.");
  } finally {
    rl.close();
  }
}
