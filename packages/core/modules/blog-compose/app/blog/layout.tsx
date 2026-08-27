import type { Metadata } from "next";
import { SITE } from "@/constants";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: SITE.blog.pageTitle,
  description: SITE.blog.pageSubtitle,
  path: "/blog",
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
