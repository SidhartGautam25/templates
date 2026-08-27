import React from "react";
import { notFound } from "next/navigation";
import { projectService } from "@/lib/features/projects";
import { projectsData } from "@/app/data/projects";
import ProjectDetailsClient from "./ProjectDetailsClient";
import { slugify } from "@/lib/utils/slugify";
import { SITE, getSiteUrl } from "@/constants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  let dbProject = null;
  try {
    const dbProjects = await projectService.listProjects();
    dbProject = dbProjects.find((p) => slugify(p.name) === slug || p.id === slug) || null;
  } catch (err) {
    console.error("Database fetch failed in generateMetadata:", err);
  }

  const project = dbProject || projectsData.find((p) => slugify(p.name) === slug || p.id === slug);

  if (!project) {
    return {
      title: `Not Found | ${SITE.brand.shortName}`,
      description: "The requested listing details could not be found.",
    };
  }

  const projectTitle = `${project.name} | ${SITE.brand.name}`;
  const projectDesc = `Discover pricing, amenities, and details of ${project.name} at ${project.location} by ${SITE.brand.name}.`;
  const projectKeywords = `${project.name}, ${project.name} ${SITE.contact.address.locality}, ${SITE.brand.name} ${project.name}, ${project.name} price, ${project.name} booking, ${SITE.brand.name}`;

  return {
    title: projectTitle,
    description: projectDesc,
    keywords: projectKeywords,
    alternates: {
      canonical: getSiteUrl(slug),
    },
    openGraph: {
      title: projectTitle,
      description: projectDesc,
      url: getSiteUrl(slug),
      siteName: SITE.brand.name,
      images: [
        {
          url: project.image || SITE.assets.logoOfficial,
          width: 800,
          height: 600,
          alt: `${project.name}`,
        },
      ],
      locale: SITE.seo.locale,
      type: "website",
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;

  let dbProject: any = null;
  try {
    const dbProjects = await projectService.listProjects();
    dbProject = dbProjects.find((p) => slugify(p.name) === slug || p.id === slug) || null;
  } catch (err) {
    console.error("Database fetch failed in Page component:", err);
  }

  const project = dbProject
    ? {
        id: dbProject.id,
        name: dbProject.name,
        location: dbProject.location,
        typology: dbProject.typology,
        price: dbProject.price,
        image: dbProject.image,
        possession: dbProject.possession || undefined,
        tag1: dbProject.tag1 || undefined,
        tag2: dbProject.tag2 || undefined,
        highlights: Array.isArray(dbProject.highlights)
          ? dbProject.highlights
          : typeof dbProject.highlights === "string"
            ? JSON.parse(dbProject.highlights)
            : [],
        rera: dbProject.rera,
        reraId: dbProject.reraId || undefined,
        reraLabel: dbProject.reraLabel || undefined,
        reraQrImage: dbProject.reraQrImage || undefined,
        category: dbProject.category,
        description: dbProject.description || undefined,
        amenities: Array.isArray(dbProject.amenities)
          ? dbProject.amenities
          : typeof dbProject.amenities === "string"
            ? JSON.parse(dbProject.amenities)
            : [],
        gallery: Array.isArray(dbProject.gallery)
          ? dbProject.gallery
          : typeof dbProject.gallery === "string"
            ? JSON.parse(dbProject.gallery)
            : [],
        floorPlans: Array.isArray(dbProject.floorPlans)
          ? dbProject.floorPlans
          : typeof dbProject.floorPlans === "string"
            ? JSON.parse(dbProject.floorPlans)
            : [],
      }
    : projectsData.find((p) => slugify(p.name) === slug || p.id === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="relative min-h-screen flex flex-col font-sans bg-bg-tan">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            name: `${project.name} | ${SITE.brand.name}`,
            image: project.image
              ? project.image.startsWith("http")
                ? project.image
                : getSiteUrl(project.image)
              : undefined,
            url: getSiteUrl(slug),
            address: {
              "@type": "PostalAddress",
              addressLocality: project.location || SITE.contact.address.locality,
              addressRegion: SITE.contact.address.region,
              addressCountry: SITE.contact.address.country,
            },
            description: `Explore pricing, amenities, and details of ${project.name} at ${project.location}.`,
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: project.price || undefined,
            },
          }),
        }}
      />
      <ProjectDetailsClient project={project} />
    </div>
  );
}
