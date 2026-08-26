import { PageRenderer } from "@/components/PageRenderer";
import { templatesOverviewPage } from "@/lib/content";

export const metadata = {
  title: templatesOverviewPage.title,
  description: templatesOverviewPage.description,
};

export default function TemplatesOverviewPage() {
  return <PageRenderer page={templatesOverviewPage} />;
}
