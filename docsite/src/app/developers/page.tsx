import { PageRenderer } from "@/components/PageRenderer";
import { developerPages } from "@/lib/content";

export default function DevelopersIntroPage() {
  const page = developerPages.intro;
  return <PageRenderer page={page} />;
}
