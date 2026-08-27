import { registerDynamicSitemapProvider } from "@/lib/seo/sitemap";
import type { SitemapPathConfig } from "@/lib/seo/types";
import { blogComposeService } from "@/lib/features/blog-compose";

registerDynamicSitemapProvider(async (): Promise<SitemapPathConfig[]> => {
  try {
    const posts = await blogComposeService.listPublic();
    return posts.map((post) => ({
      path: `/blog/${post.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
      lastModified: post.publishedAt ?? post.updatedAt,
    }));
  } catch (error) {
    console.error("[sitemap] failed to list blog posts:", error);
    return [];
  }
});
