import type { MetadataRoute } from "next";
import { projectsData } from "@/app/data/projects";
import { projectService } from "@/lib/services/ProjectService";
import { slugify } from "@/lib/utils/slugify";
import { SITE } from "@/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE.domain.baseUrl;

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  let dbProjects: any[] = [];
  try {
    dbProjects = await projectService.listProjects();
  } catch (err) {
    console.error("Failed to list projects for sitemap:", err);
  }

  const processedSlugs = new Set<string>();

  const addProjectUrl = (name: string, id: string) => {
    const slug = slugify(name) || id;
    if (slug && !processedSlugs.has(slug)) {
      processedSlugs.add(slug);
      routes.push({
        url: `${baseUrl}/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  };

  for (const project of dbProjects) {
    addProjectUrl(project.name, project.id);
  }

  for (const project of projectsData) {
    addProjectUrl(project.name, project.id);
  }

  return routes;
}
