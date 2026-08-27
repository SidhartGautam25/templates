# Godrej Properties Pune - SEO & Indexing Optimization Guide

This guide explains the search engine optimization (SEO) improvements implemented on the **Godrej Properties Pune** website to help it rank higher for both broad search terms (e.g., *"Godrej property"*, *"Pune Godrej properties"*) and individual project queries (e.g., *"Godrej River Royale price"*, *"Godrej Skyline Hinjewadi"*).

---

## Table of Contents
1. [Favicon & Brand Representation in Search Results](#1-favicon--brand-representation-in-search-results)
2. [Dynamic Sitemap (`sitemap.xml`)](#2-dynamic-sitemap-sitemapxml)
3. [Project-Specific Dynamic Metadata](#3-project-specific-dynamic-metadata)
4. [Structured Data (JSON-LD Schema)](#4-structured-data-json-ld-schema)
5. [Next Steps: Google Search Console Setup](#5-next-steps-google-search-console-setup)

---

## 1. Favicon & Brand Representation in Search Results

### Problem
Previously, when your site appeared in Google search results, it displayed a generic "globe" icon instead of the Godrej logo. Google shows this globe fallback when a website uses the default Next.js starter favicon or doesn't define square high-resolution brand icons.

### Solution
1. **Emblem Extraction**: We extracted the signature circular emblem from the left side of the official logo (`public/godrej_logo_final.jpeg`).
2. **Icon Set Generation**: We generated a standard `.ico` file containing multiple resolutions (`16x16`, `32x32`, `48x48`, `64x64`) for browser compatibility, along with high-resolution `192x192` and `512x512` PNG versions for modern search result pages.
3. **Metadata Link Insertion**:
   In [layout.tsx](file:///home/sidharthg/sid/project/free/godrej/app/layout.tsx), we registered these icons in Next.js's metadata object so they are served correctly:

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  // ...
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" }
    ],
  },
};
```

This ensures that whenever Google’s crawler indexes your site, it will download your custom brand emblem and display it as your search result icon.

---

## 2. Dynamic Sitemap (`sitemap.xml`)

### Explanation
A sitemap is an XML file that lists all critical pages of a website, making sure search engines can discover them easily. Because you can add new projects to the site via the Admin Dashboard, the sitemap must be **dynamic**—automatically updating itself whenever a new project is created in the database.

### Implementation
We configured Next.js to dynamically query the database using the `ProjectService` FTP/Database layer, format the project names into slugs, merge them with any static fallback projects, and build a unified sitemap structure.

Code reference: [sitemap.ts](file:///home/sidharthg/sid/project/free/godrej/app/sitemap.ts)

```typescript
// app/sitemap.ts
import type { MetadataRoute } from "next";
import { projectsData } from "@/app/data/projects";
import { projectService } from "@/lib/services/ProjectService";
import { slugify } from "@/lib/utils/slugify";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://godrejpropertypune.com";

  // 1. Add static base routes (homepage)
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // 2. Fetch all project pages added via the admin dashboard
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
        priority: 0.8, // High priority for individual landing pages
      });
    }
  };

  // Add DB projects and static fallback data
  for (const project of dbProjects) {
    addProjectUrl(project.name, project.id);
  }
  for (const project of projectsData) {
    addProjectUrl(project.name, project.id);
  }

  return routes;
}
```

---

## 3. Project-Specific Dynamic Metadata

### Explanation
To rank for terms like *"Godrej Skyline Hinjewadi price"* or *"Godrej River Royale carpet area"*, each project page must have search-optimized titles, meta descriptions, and keywords. If all pages share the same homepage title, Google will flag it as duplicate content and hide it from search results.

### Implementation
We modified [page.tsx](file:///home/sidharthg/sid/project/free/godrej/app/[slug]/page.tsx) inside the dynamic slug folder to implement `generateMetadata`. This function looks up the requested project, extracts its values (name, location, price, image), and returns target-rich meta tags.

```typescript
// app/[slug]/page.tsx
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  
  let dbProject = null;
  try {
    const dbProjects = await projectService.listProjects();
    dbProject = dbProjects.find(p => slugify(p.name) === slug || p.id === slug) || null;
  } catch (err) {
    console.error("Database fetch failed in generateMetadata:", err);
  }

  const project = dbProject || projectsData.find((p) => slugify(p.name) === slug || p.id === slug);

  if (!project) {
    return {
      title: "Project Not Found | Godrej Pune",
      description: "The requested project details could not be found.",
    };
  }

  const projectTitle = `${project.name} | Godrej Properties Pune`;
  const projectDesc = `Discover price, floor plans, location map, and reviews of ${project.name} in ${project.location}, Pune by Godrej Properties.`;
  
  // Custom SEO keyword generation incorporating various search variations
  const projectKeywords = `${project.name}, ${project.name} Pune, Godrej ${project.name}, Godrej ${project.name} Pune, Godrej Properties ${project.name}, ${project.name} price, ${project.name} floor plan, ${project.name} contact number, Godrej Properties Pune, Godrej Pune, Godrej Property`;

  return {
    title: projectTitle,
    description: projectDesc,
    keywords: projectKeywords,
    alternates: {
      canonical: `https://godrejpropertypune.com/${slug}`,
    },
    openGraph: {
      title: projectTitle,
      description: projectDesc,
      url: `https://godrejpropertypune.com/${slug}`,
      siteName: "Godrej Property Pune",
      images: [
        {
          url: project.image || "/godrej_logo_final.jpeg",
          width: 800,
          height: 600,
          alt: `${project.name} Logo`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
  };
}
```

---

## 4. Structured Data (JSON-LD Schema)

### Explanation
Structured data is a standardized format (using schema.org vocabularies) for providing information about a page and classifying its content. Adding structured data enables Google to display your pages with "Rich Snippets" (e.g., price ranges, images, and reviews right inside the search results).

### Implementation
We injected JSON-LD schema objects on both the homepage and dynamic project pages:
1. **Homepage Schema (`RealEstateAgent`)**: Describes your overall brand/agency name, site URL, location (Pune, India), and general price range.
2. **Project Page Schema (`ApartmentComplex`)**: Tells Google that the page is a specific residential housing complex, linking its exact location, localized pricing, and image.

Here is the implementation in [page.tsx](file:///home/sidharthg/sid/project/free/godrej/app/[slug]/page.tsx):

```tsx
// app/[slug]/page.tsx
return (
  <div className="relative min-h-screen flex flex-col font-sans bg-bg-tan">
    {/* JSON-LD Structured Data Schema */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ApartmentComplex",
          "name": `${project.name} | Godrej Properties Pune`,
          "image": project.image ? (project.image.startsWith("http") ? project.image : `https://godrejpropertypune.com${project.image}`) : undefined,
          "url": `https://godrejpropertypune.com/${slug}`,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": project.location || "Pune",
            "addressRegion": "MH",
            "addressCountry": "IN"
          },
          "description": `Explore premium properties, pricing, layouts, floor plans, and amenities of ${project.name} located at ${project.location}.`,
          "offers": {
            "@type": "Offer",
            "priceCurrency": "INR",
            "price": project.price || undefined
          }
        })
      }}
    />
    <ProjectDetailsClient project={project} />
  </div>
);
```

---

## 5. Next Steps: Google Search Console Setup

Google's crawler can take up to a few weeks to naturally discover changes. To force Google to scan these upgrades and index your pages immediately, follow these steps:

### Step 1: Verify Ownership
1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add your website domain: `https://godrejpropertypune.com`.
3. Choose a verification method (e.g., uploading the Google HTML verification file to your public folder or adding a DNS TXT record).

### Step 2: Submit your Sitemap
1. Inside Search Console, click on **Sitemaps** in the left-hand menu.
2. Under "Add a new sitemap", type `sitemap.xml`.
3. Click **Submit**. Google will read the sitemap file and add all listed dynamic project pages to its crawl queue.

### Step 3: Request Indexing for the Homepage
1. Copy your URL `https://godrejpropertypune.com`.
2. Paste it into the "Inspect any URL" search box at the top of Search Console.
3. Click **Request Indexing**. This prioritizes your homepage in Google's indexing queue, forcing it to fetch the updated keywords and your new brand icon.
