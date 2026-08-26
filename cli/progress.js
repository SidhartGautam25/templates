/**
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * @param {number} ms
 * @returns {string}
 */
export function formatDuration(ms) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * @param {{
 *   templateId: string,
 *   stats: { bytes: number, files: number, durationMs: number, source?: string }
 * }} options
 */
export function printFetchComplete(options) {
  const { templateId, stats } = options;
  const sourceLabel = stats.source === "local" ? "local copy" : "download";
  const sizePart = stats.bytes > 0 ? `${formatBytes(stats.bytes)}, ` : "";
  console.log(
    `Fetching template "${templateId}"... done (${sizePart}${stats.files} files, ${formatDuration(stats.durationMs)}, ${sourceLabel})`
  );
}
