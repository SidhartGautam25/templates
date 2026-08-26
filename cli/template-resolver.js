import { removeDirectory } from "./copy.js";
import { fetchTemplateFromGitHub, loadLocalTemplate } from "./fetch.js";

/**
 * @typedef {{
 *   templateRoot: string,
 *   cleanupDir: string,
 *   stats: import('./fetch.js').FetchStats,
 *   release: () => void
 * }} ResolvedTemplate
 */

/**
 * Resolve template source from local package or remote GitHub tarball.
 * @param {{
 *   repo: import('./config.js').RepositoryConfig,
 *   packageRoot: string,
 *   templateDirectory: string,
 *   useRemote: boolean
 * }} options
 * @returns {Promise<ResolvedTemplate>}
 */
export async function resolveTemplateSource(options) {
  const { repo, packageRoot, templateDirectory, useRemote } = options;

  let result = null;

  if (!useRemote) {
    result = await loadLocalTemplate(packageRoot, repo.templatesPath, templateDirectory);
  }

  if (!result) {
    result = await fetchTemplateFromGitHub(repo, templateDirectory);
  }

  const cleanupDir = result.cleanupDir;

  return {
    templateRoot: result.templateRoot,
    cleanupDir,
    stats: result.stats,
    release: () => {
      if (cleanupDir) {
        removeDirectory(cleanupDir);
      }
    },
  };
}
