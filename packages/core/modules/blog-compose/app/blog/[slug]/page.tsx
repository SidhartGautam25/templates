import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SITE } from "@/constants";
import { blogComposeService } from "@/lib/features/blog-compose";
import { ComposeBlogRenderer } from "@/lib/blog/compose";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await blogComposeService.getPublishedBySlug(slug);
  if (!post) return {};
  return buildPageMetadata({
    title: post.title,
    description: post.excerpt ?? undefined,
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await blogComposeService.getPublishedBySlug(slug);
  if (!post) notFound();

  const content = blogComposeService.contentFromPost(post);

  return (
    <div className="min-h-screen bg-bg-main">
      <header className="border-b border-primary/10 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            {SITE.blog.backToBlog}
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-text-muted truncate">
            {SITE.blog.pageTitle}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-10 border-b border-primary/10 pb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-primary">{post.title}</h1>
          {post.excerpt && (
            <p className="mt-4 text-lg text-text-muted leading-relaxed">{post.excerpt}</p>
          )}
          {post.publishedAt && (
            <time
              className="mt-4 block text-[10px] font-bold uppercase tracking-widest text-text-muted"
              dateTime={post.publishedAt.toISOString()}
            >
              {post.publishedAt.toLocaleDateString()}
            </time>
          )}
        </header>
        <ComposeBlogRenderer document={content} />
      </main>
    </div>
  );
}
