/**
 * Converts a string (e.g. project name) into a clean, dash-separated URL slug.
 * Shared core utility — safe to customize per project.
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars (except spaces and dashes)
    .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with a single dash
    .replace(/^-+|-+$/g, ""); // Trim leading/trailing dashes
}
