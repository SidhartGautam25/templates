import { DocLayout } from "@/layouts/DocLayout";

export default function MaintainersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocLayout activeAudience="maintainers">{children}</DocLayout>;
}
