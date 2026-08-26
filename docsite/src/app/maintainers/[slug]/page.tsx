import { notFound } from "next/navigation";
import { PageRenderer } from "@/components/PageRenderer";
import { maintainerPages } from "@/lib/content";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return Object.keys(maintainerPages)
    .filter((slug) => slug !== "intro")
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = maintainerPages[slug];
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
  };
}

export default async function MaintainerGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const page = maintainerPages[slug];

  if (!page || slug === "intro") {
    notFound();
  }

  return <PageRenderer page={page} />;
}
