import { notFound } from "next/navigation";
import { PageRenderer } from "@/components/PageRenderer";
import { developerPages } from "@/lib/content";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return Object.keys(developerPages)
    .filter((slug) => slug !== "intro")
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = developerPages[slug];
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
  };
}

export default async function DeveloperGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const page = developerPages[slug];

  if (!page || slug === "intro") {
    notFound();
  }

  return <PageRenderer page={page} />;
}
