import { ComposePlayground } from "@/components/blog/ComposePlayground";

export const metadata = {
  title: "Compose playground — blog demo",
  description: "Edit Compose JSON and preview blog blocks live.",
};

export default function BlogPlaygroundPage() {
  return <ComposePlayground />;
}
