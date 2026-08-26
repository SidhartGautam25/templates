import { DocLayout } from "@/layouts/DocLayout";

export default function DevelopersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocLayout activeAudience="developers">{children}</DocLayout>;
}
