import type { Metadata } from "next";
import { SITE } from "@/constants";
import { blogComposeService } from "@/lib/features/blog-compose";
import { buildPageMetadata } from "@/lib/seo/metadata";
import BlogShell from "@/app/components/BlogShell";

export const metadata: Metadata = buildPageMetadata({
  title: SITE.blog.pageTitle,
  description: SITE.blog.pageSubtitle,
  path: "/blog",
});

export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  if (!SITE.features.blogSidebar) {
    return children;
  }

  const posts = await blogComposeService.listPublic();
  const sidebarPosts = posts.map((p) => ({ slug: p.slug, title: p.title }));

  return <BlogShell posts={sidebarPosts}>{children}</BlogShell>;
}
