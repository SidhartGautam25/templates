import Link from "next/link";
import postsRegistry from "@content/blog/posts.json";
import { getAllBlogPosts, type BlogPostsRegistry } from "@/lib/blog-posts";

export const metadata = {
  title: "Blog demo — Compose engine",
  description: "Live preview of the blog-compose module using JSON block documents.",
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts(postsRegistry as BlogPostsRegistry);

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--color-doc-text)]">Blog demo</h1>
        <p className="mt-3 text-[var(--color-doc-muted)] leading-relaxed">
          These articles are Compose documents — the same JSON shape stored in{" "}
          <code className="text-xs bg-[var(--color-doc-surface-elevated)] px-1.5 py-0.5 rounded">
            BlogPost.contentJson
          </code>{" "}
          on client sites. Use this to preview block styling before installing{" "}
          <code className="text-xs bg-[var(--color-doc-surface-elevated)] px-1.5 py-0.5 rounded">
            blog-compose
          </code>.
        </p>
      </header>

      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block rounded-xl border border-[var(--color-doc-border)] bg-[var(--color-doc-surface)] p-6 hover:border-[var(--color-doc-accent)] transition-colors"
            >
              <h2 className="text-xl font-semibold text-[var(--color-doc-accent)]">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-[var(--color-doc-muted)] line-clamp-2">
                {post.excerpt}
              </p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-doc-muted)]">
                {new Date(post.publishedAt).toLocaleDateString()}
                {post.author ? ` · ${post.author}` : ""}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
