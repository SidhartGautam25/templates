import Link from "next/link";
import { notFound } from "next/navigation";
import postsRegistry from "@content/blog/posts.json";
import { DocComposeRenderer } from "@/components/blog-compose/DocComposeRenderer";
import {
  getBlogPostBySlug,
  getBlogPostSlugs,
  type BlogPostsRegistry,
} from "@/lib/blog-posts";

const registry = postsRegistry as BlogPostsRegistry;

export function generateStaticParams() {
  return getBlogPostSlugs(registry).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(registry, slug);
  if (!post) return {};
  return {
    title: `${post.title} — blog demo`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(registry, slug);
  if (!post) notFound();

  return (
    <article>
      <Link
        href="/blog"
        className="text-sm font-medium text-[var(--color-doc-accent)] hover:opacity-90"
      >
        ← All demo articles
      </Link>

      <header className="mt-6 mb-10 border-b border-[var(--color-doc-border)] pb-8">
        <h1 className="text-3xl font-bold text-[var(--color-doc-text)]">{post.title}</h1>
        <p className="mt-4 text-lg text-[var(--color-doc-muted)] leading-relaxed">{post.excerpt}</p>
        <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-doc-muted)]">
          {new Date(post.publishedAt).toLocaleDateString()}
          {post.author ? ` · ${post.author}` : ""}
        </p>
      </header>

      <DocComposeRenderer document={post.content} />
    </article>
  );
}
