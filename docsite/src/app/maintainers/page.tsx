import { PageRenderer } from "@/components/PageRenderer";
import { maintainerPages } from "@/lib/content";

export default function MaintainersIntroPage() {
  const page = maintainerPages.intro;
  return <PageRenderer page={page} />;
}
