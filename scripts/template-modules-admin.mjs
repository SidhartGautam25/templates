import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * @param {string[]} moduleIds
 * @returns {string}
 */
export function buildAdminContentPageSource(moduleIds) {
  const hasGallery = moduleIds.includes("gallery");
  const hasReviews = moduleIds.includes("reviews");

  if (!hasGallery && !hasReviews) return "";

  const imports = [
    'import { redirect } from "next/navigation";',
    'import { auth } from "@/auth";',
  ];
  if (hasGallery) imports.push('import GalleryList from "@/app/admin/components/GalleryList";');
  if (hasReviews) imports.push('import ReviewsList from "@/app/admin/components/ReviewsList";');

  const lines = [
    ...imports,
    "",
    "export default async function AdminContentPage() {",
    "  const session = await auth();",
    "  if (!session) redirect(\"/admin/login\");",
    "",
    "  return (",
    "    <div className=\"min-h-screen bg-bg-main p-6 md:p-10\">",
    "      <div className=\"max-w-6xl mx-auto space-y-10\">",
    "        <header>",
    "          <h1 className=\"text-2xl font-bold font-serif text-primary\">Content modules</h1>",
    "          <p className=\"text-sm text-text-muted mt-1\">",
    "            Manage gallery images and testimonials from optional core modules.",
    "          </p>",
    "          <p className=\"text-xs text-text-muted mt-2\">",
    "            Route: <code className=\"text-primary\">/admin/content</code>",
    "          </p>",
    "        </header>",
  ];

  if (hasGallery) lines.push("        <GalleryList />");
  if (hasReviews) lines.push("        <ReviewsList />");

  lines.push(
    "      </div>",
    "    </div>",
    "  );",
    "}",
    ""
  );

  return lines.join("\n");
}

/**
 * @param {string} templateRoot
 * @param {string[]} moduleIds
 */
export function applyAdminContentPage(templateRoot, moduleIds) {
  const source = buildAdminContentPageSource(moduleIds);
  if (!source) return;

  const dest = join(templateRoot, "app/admin/content/page.tsx");
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, source, "utf8");
  console.log("  ✓ added app/admin/content/page.tsx");
}
