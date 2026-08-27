#!/usr/bin/env node
/**
 * Adopt core seo, gallery, and reviews modules in shipped hotel/real-estate templates.
 */
import { join } from "node:path";

import { copyModulesIntoTemplate } from "./template-modules.mjs";
import { resolveTemplateRef, templateRootPath, ensureTemplateExists } from "./template-cli-utils.mjs";

const hotel = resolveTemplateRef("hotel");
const realEstate = resolveTemplateRef("real-estate");

const hotelRoot = templateRootPath(hotel);
const realEstateRoot = templateRootPath(realEstate);

ensureTemplateExists(hotelRoot, hotel.directory);
ensureTemplateExists(realEstateRoot, realEstate.directory);

console.log("Migrating hotel → core seo, gallery, reviews");
copyModulesIntoTemplate(hotelRoot, ["seo", "gallery", "reviews"], {
  displayName: "Hotel",
  skipHomePage: true,
  skipAdminTabRegistry: true,
  skipSeoMetadataReplace: true,
  excludePaths: ["app/gallery/page.tsx", "app/gallery/layout.tsx"],
});

console.log("\nMigrating real-estate → core seo");
copyModulesIntoTemplate(realEstateRoot, ["seo"], {
  displayName: "Real Estate",
  skipHomePage: true,
  skipAdminTabRegistry: true,
  skipSeoMetadataReplace: true,
});

console.log("\n✓ Shipped template core module migration complete.");
