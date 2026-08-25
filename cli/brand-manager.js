import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { readFile, writeFile } from "node:fs/promises";
import { findSiteTs } from "./theme-manager.js";

export async function promptAndApplyBrand(targetDir) {
  const siteTsPath = await findSiteTs(targetDir);
  if (!siteTsPath) {
    console.error("Error: Could not locate constants/site.ts. Make sure you are inside an initialized tempjs template directory.");
    return;
  }

  // Load current values if possible to provide defaults
  let siteContent = await readFile(siteTsPath, "utf8");

  // Parse existing values using simple regex
  const currentBrandName = (siteContent.match(/name:\s*"([^"]+)"/) || [])[1] || "Chanakya Resort";
  const currentShortName = (siteContent.match(/shortName:\s*"([^"]+)"/) || [])[1] || "Chanakya";
  const currentBaseUrl = (siteContent.match(/baseUrl:\s*"([^"]+)"/) || [])[1] || "https://chanakyaresort.com";
  const currentPhone = (siteContent.match(/phone:\s*"([^"]+)"/) || [])[1] || "9876543210";
  const currentPhoneDisplay = (siteContent.match(/phoneDisplay:\s*"([^"]+)"/) || [])[1] || "+91 98765 43210";
  const currentCountryCode = (siteContent.match(/countryCode:\s*"([^"]+)"/) || [])[1] || "91";
  const currentEmail = (siteContent.match(/email:\s*"([^"]+)"/) || [])[1] || "reservations@chanakyaresort.com";
  const currentAddress = (siteContent.match(/full:\s*"([^"]+)"/) || [])[1] || "Lonavala, Maharashtra, India";

  const rl = createInterface({ input, output });
  try {
    console.log("\n--- Configure Brand & Contact Details ---");

    const brandName = (await rl.question(`Brand Name [${currentBrandName}]: `)).trim() || currentBrandName;
    const shortName = (await rl.question(`Short/Display Name [${currentShortName}]: `)).trim() || currentShortName;
    const baseUrl = (await rl.question(`Base URL [${currentBaseUrl}]: `)).trim() || currentBaseUrl;

    // Derive wwwHost from baseUrl
    let wwwHost = "www.example.com";
    try {
      const url = new URL(baseUrl);
      wwwHost = url.hostname.startsWith("www.") ? url.hostname : `www.${url.hostname}`;
    } catch {
      wwwHost = baseUrl.replace(/^https?:\/\//, "");
      if (!wwwHost.startsWith("www.")) wwwHost = `www.${wwwHost}`;
    }

    const phone = (await rl.question(`Contact Phone Number [${currentPhone}]: `)).trim() || currentPhone;
    const phoneDisplay = (await rl.question(`Display Phone Number [${currentPhoneDisplay}]: `)).trim() || currentPhoneDisplay;
    const countryCode = (await rl.question(`Country Code [${currentCountryCode}]: `)).trim() || currentCountryCode;
    const email = (await rl.question(`Contact Email [${currentEmail}]: `)).trim() || currentEmail;
    const address = (await rl.question(`Full Address [${currentAddress}]: `)).trim() || currentAddress;

    // Build replacement blocks
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

    // Extract address locality/region/country or keep defaults
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

    // Apply replacements using exact patterns matching our templates
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

    await writeFile(siteTsPath, siteContent, "utf8");
    console.log("Successfully updated brand and contact configurations in constants/site.ts.");
  } finally {
    rl.close();
  }
}
