import { notFound } from "next/navigation";
import { PageRenderer } from "@/components/PageRenderer";
import {
  getTemplatePage,
  getTemplateRegistryEntry,
  templateRegistry,
} from "@/lib/content";

interface PageProps {
  params: Promise<{
    templateId: string;
  }>;
}

export function generateStaticParams() {
  return templateRegistry.templates.map((t) => ({ templateId: t.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { templateId } = await params;
  const page = getTemplatePage(templateId);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
  };
}

export default async function TemplateGuidePage({ params }: PageProps) {
  const { templateId } = await params;
  const page = getTemplatePage(templateId);
  const entry = getTemplateRegistryEntry(templateId);

  if (!page || !entry) {
    notFound();
  }

  return <PageRenderer page={page} templateEntry={entry} />;
}
