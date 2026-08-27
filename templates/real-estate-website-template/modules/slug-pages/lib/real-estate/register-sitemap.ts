import { registerDynamicSitemapProvider } from "@/lib/seo/sitemap";
import type { SitemapPathConfig } from "@/lib/seo/types";
import { projectsData } from "@/app/data/projects";
import { projectService } from "@/lib/features/projects";
import { slugify } from "@/lib/utils/slugify";

registerDynamicSitemapProvider(async (): Promise<SitemapPathConfig[]> => {
  const routes: SitemapPathConfig[] = [];
  const processedSlugs = new Set<string>();

  const addProject = (name: string, id: string) => {
    const slug = slugify(name) || id;
    if (!slug || processedSlugs.has(slug)) return;
    processedSlugs.add(slug);
    routes.push({
      path: `/${slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  };

  try {
    const dbProjects = await projectService.listProjects();
    for (const project of dbProjects) {
      addProject(project.name, project.id);
    }
  } catch (error) {
    console.error("[sitemap] failed to list projects:", error);
  }

  for (const project of projectsData) {
    addProject(project.name, project.id);
  }

  return routes;
});
