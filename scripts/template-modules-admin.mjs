import { mkdirSync, readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * Shipped templates with vertical admin tabs (room types, projects, facilities).
 * @param {string} content
 */
export function isVerticalAdminRegistry(content) {
  return (
    content.includes("RoomTypesPanel") ||
    content.includes("ProjectsPanel") ||
    content.includes("FacilitiesList")
  );
}

/**
 * @param {string} content
 * @param {string} iconName
 */
function addLucideIcon(content, iconName) {
  if (content.includes(iconName)) return content;

  const blockMatch = content.match(/import\s*\{([^}]+)\}\s*from\s*"lucide-react";/s);
  if (blockMatch) {
    const icons = blockMatch[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!icons.includes(iconName)) {
      icons.push(iconName);
    }
    const formatted = icons.map((i) => `  ${i}`).join(",\n");
    return content.replace(
      blockMatch[0],
      `import {\n${formatted},\n} from "lucide-react";`
    );
  }

  const singleMatch = content.match(
    /import\s*\{([^}]+)\}\s*from\s*"lucide-react";/
  );
  if (singleMatch && !singleMatch[1].includes("\n")) {
    const icons = singleMatch[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!icons.includes(iconName)) icons.push(iconName);
    return content.replace(
      singleMatch[0],
      `import { ${icons.join(", ")} } from "lucide-react";`
    );
  }

  return `import { ${iconName} } from "lucide-react";\n${content}`;
}

/**
 * @param {string} content
 * @param {string} importLine
 */
function ensureComponentImport(content, importLine) {
  if (content.includes(importLine)) return content;
  const anchor = content.match(/import type \{ AdminTabDefinition \}/);
  if (anchor) {
    return content.replace(
      /import type \{ AdminTabDefinition \}[^\n]+\n/,
      `$&${importLine}\n`
    );
  }
  return `${importLine}\n${content}`;
}

/**
 * @param {string} content
 */
function ensureSiteImport(content) {
  if (content.includes('from "@/constants"')) return content;
  return `import { SITE } from "@/constants";\n${content}`;
}

/**
 * Merge gallery/reviews tab blocks into an existing vertical template registry.
 * @param {string} registryPath
 * @param {string[]} moduleIds
 */
export function mergeGalleryReviewsIntoRegistry(registryPath, moduleIds) {
  let content = readFileSync(registryPath, "utf8");
  const hasGallery = moduleIds.includes("gallery");
  const hasReviews = moduleIds.includes("reviews");

  if (hasGallery || hasReviews) {
    content = ensureSiteImport(content);
  }

  if (hasGallery) {
    content = addLucideIcon(content, "Images");
    content = ensureComponentImport(
      content,
      'import GalleryList from "./components/GalleryList";'
    );

    if (!content.includes('id: "gallery"')) {
      const galleryBlock = `
  if (SITE.features.gallery) {
    tabs.push({
      id: "gallery",
      label: "Photo Gallery",
      icon: Images,
      Panel: GalleryList,
      featureFlag: "gallery",
    });
  }`;

      content = content.replace(/\n  return tabs;/, `${galleryBlock}\n\n  return tabs;`);
    }
  }

  if (hasReviews) {
    content = addLucideIcon(content, "MessageSquare");
    content = ensureComponentImport(
      content,
      'import ReviewsList from "./components/ReviewsList";'
    );

    if (!content.includes('id: "reviews"')) {
      const reviewsBlock = `
  if (SITE.features.reviews) {
    tabs.push({
      id: "reviews",
      label: "Testimonials",
      icon: MessageSquare,
      Panel: ReviewsList,
      featureFlag: "reviews",
    });
  }`;

      content = content.replace(/\n  return tabs;/, `${reviewsBlock}\n\n  return tabs;`);
    }
  }

  writeFileSync(registryPath, content, "utf8");
}

/**
 * Generated registry for scaffold / client projects (no vertical tabs).
 * @param {string[]} moduleIds
 * @returns {string}
 */
export function buildScaffoldAdminRegistrySource(moduleIds) {
  const hasGallery = moduleIds.includes("gallery");
  const hasReviews = moduleIds.includes("reviews");

  const imports = [
    'import type { AdminTabDefinition } from "@/lib/admin/types";',
    'import { Users, Sliders, Award, Palette } from "lucide-react";',
    'import LeadsPanel from "./panels/LeadsPanel";',
    'import PromoBannerForm from "./components/PromoBannerForm";',
    'import LaunchLogoForm from "./components/LaunchLogoForm";',
    'import ThemeEditor from "./components/ThemeEditor";',
  ];

  if (hasGallery || hasReviews) {
    imports.unshift('import { SITE } from "@/constants";');
  }

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
    "/** Scaffold admin tabs — leads, theme, promo, logo; gallery/reviews when modules installed. */",
    "export function getAdminTabs(): AdminTabDefinition[] {",
    "  const tabs: AdminTabDefinition[] = [",
    "    { id: \"leads\", label: \"Customer Leads\", icon: Users, Panel: LeadsPanel },",
    "    { id: \"theme\", label: \"Theme & Colors\", icon: Palette, Panel: ThemeEditor },",
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

/** @deprecated Use buildScaffoldAdminRegistrySource */
export function buildAdminRegistrySource(moduleIds) {
  return buildScaffoldAdminRegistrySource(moduleIds);
}

/**
 * @param {string} templateRoot
 */
export function removeLegacyAdminContentPage(templateRoot) {
  const contentPage = join(templateRoot, "app", "admin", "content", "page.tsx");
  if (existsSync(contentPage)) {
    unlinkSync(contentPage);
    console.log("  ✓ removed legacy app/admin/content/page.tsx");
  }
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
 * Wire scaffold registry + dashboard (no gallery/reviews modules).
 * @param {string} templateRoot
 */
export function applyScaffoldAdminRegistry(templateRoot) {
  const registryPath = join(templateRoot, "app", "admin", "registry.ts");
  if (!existsSync(registryPath)) {
    writeFileSync(registryPath, buildScaffoldAdminRegistrySource([]), "utf8");
    console.log("  ✓ created app/admin/registry.ts (scaffold tabs)");
  }
  applyAdminDashboard(templateRoot);
}

/**
 * Regenerate or merge admin tab registry when gallery/reviews modules are installed.
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
  const existing = existsSync(registryPath) ? readFileSync(registryPath, "utf8") : "";

  if (existing && isVerticalAdminRegistry(existing)) {
    mergeGalleryReviewsIntoRegistry(registryPath, moduleIds);
    console.log("  ✓ merged gallery/reviews tabs into app/admin/registry.ts");
  } else {
    mkdirSync(dirname(registryPath), { recursive: true });
    writeFileSync(registryPath, buildScaffoldAdminRegistrySource(moduleIds), "utf8");
    console.log("  ✓ updated app/admin/registry.ts with module tabs");
    applyAdminDashboard(templateRoot);
  }

  removeLegacyAdminContentPage(templateRoot);
}

/** @deprecated Use applyAdminTabRegistry + applyAdminDashboard */
export function applyAdminContentPage(templateRoot, moduleIds) {
  applyAdminTabRegistry(templateRoot, moduleIds);
}
