import { mkdirSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * @param {string[]} moduleIds
 * @returns {string}
 */
export function buildAdminRegistrySource(moduleIds) {
  const hasGallery = moduleIds.includes("gallery");
  const hasReviews = moduleIds.includes("reviews");

  const imports = [
    'import { SITE } from "@/constants";',
    'import type { AdminTabDefinition } from "@/lib/admin/types";',
    'import { Users, Sliders, Award } from "lucide-react";',
    'import LeadsPanel from "./panels/LeadsPanel";',
    'import PromoBannerForm from "./components/PromoBannerForm";',
    'import LaunchLogoForm from "./components/LaunchLogoForm";',
  ];

  if (hasGallery) {
    imports.push('import { Images } from "lucide-react";');
    imports.push('import GalleryList from "./components/GalleryList";');
  }
  if (hasReviews) {
    imports.push('import { MessageSquare } from "lucide-react";');
    imports.push('import ReviewsList from "./components/ReviewsList";');
  }

  const lines = [
    ...imports,
    "",
    "export function getAdminTabs(): AdminTabDefinition[] {",
    "  const tabs: AdminTabDefinition[] = [",
    "    { id: \"leads\", label: \"Customer Leads\", icon: Users, Panel: LeadsPanel },",
    "    { id: \"banner\", label: \"Promo Settings\", icon: Sliders, Panel: PromoBannerForm },",
    "    { id: \"logo\", label: \"Launch Logo\", icon: Award, Panel: LaunchLogoForm },",
    "  ];",
  ];

  if (hasGallery) {
    lines.push(
      "",
      "  if (SITE.features.gallery) {",
      "    tabs.push({",
      "      id: \"gallery\",",
      "      label: \"Photo Gallery\",",
      "      icon: Images,",
      "      Panel: GalleryList,",
      "      featureFlag: \"gallery\",",
      "    });",
      "  }"
    );
  }

  if (hasReviews) {
    lines.push(
      "",
      "  if (SITE.features.reviews) {",
      "    tabs.push({",
      "      id: \"reviews\",",
      "      label: \"Testimonials\",",
      "      icon: MessageSquare,",
      "      Panel: ReviewsList,",
      "      featureFlag: \"reviews\",",
      "    });",
      "  }"
    );
  }

  lines.push("", "  return tabs;", "}", "");

  return lines.join("\n");
}

/**
 * @param {string} templateRoot
 */
export function applyAdminDashboard(templateRoot) {
  const pageSource = [
    '"use client";',
    "",
    "import React, { useMemo, useState } from \"react\";",
    "import AdminShell from \"@/lib/admin/AdminShell\";",
    "import { getAdminTabs } from \"./registry\";",
    "import { useGetLeads } from \"./hooks/useLeads\";",
    "",
    "export default function AdminDashboard() {",
    "  const tabs = useMemo(() => getAdminTabs(), []);",
    "  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? \"leads\");",
    "  const { isLoading: isLoadingLeads } = useGetLeads();",
    "",
    "  return (",
    "    <AdminShell",
    "      tabs={tabs}",
    "      activeTabId={activeTabId}",
    "      onTabChange={setActiveTabId}",
    "      title=\"Management Dashboard\"",
    "      subtitle=\"Manage leads, site settings, and optional content modules.\"",
    "      loading={activeTabId === \"leads\" && isLoadingLeads}",
    "    />",
    "  );",
    "}",
    "",
  ].join("\n");

  const pagePath = join(templateRoot, "app", "admin", "page.tsx");
  mkdirSync(dirname(pagePath), { recursive: true });
  writeFileSync(pagePath, pageSource, "utf8");
  console.log("  ✓ wired unified app/admin/page.tsx dashboard");
}

/**
 * Regenerate tab registry when optional CMS modules are installed.
 * @param {string} templateRoot
 * @param {string[]} moduleIds
 */
export function applyAdminTabRegistry(templateRoot, moduleIds) {
  const hasGallery = moduleIds.includes("gallery");
  const hasReviews = moduleIds.includes("reviews");

  if (!hasGallery && !hasReviews) {
    return;
  }

  const registryPath = join(templateRoot, "app", "admin", "registry.ts");
  writeFileSync(registryPath, buildAdminRegistrySource(moduleIds), "utf8");
  console.log("  ✓ updated app/admin/registry.ts with module tabs");

  applyAdminDashboard(templateRoot);

  const contentPage = join(templateRoot, "app", "admin", "content", "page.tsx");
  if (existsSync(contentPage)) {
    unlinkSync(contentPage);
    console.log("  ✓ removed legacy app/admin/content/page.tsx");
  }
}

/** @deprecated Use applyAdminTabRegistry + applyAdminDashboard */
export function applyAdminContentPage(templateRoot, moduleIds) {
  applyAdminTabRegistry(templateRoot, moduleIds);
}
