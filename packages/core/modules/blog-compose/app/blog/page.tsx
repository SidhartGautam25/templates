"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { SITE } from "@/constants";

interface BlogListItem {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  coverImage?: string | null;
  publishedAt?: string | null;
  createdAt: string;
}

const withSidebar = SITE.features.blogSidebar;

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/blog-posts");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setPosts(json.data);
        }
      } catch (err) {
        console.warn("Blog index: failed to load", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const listContent = (
    <>
      <p className="text-text-muted text-sm mb-10">{SITE.blog.pageSubtitle}</p>
      {loading ? (
        <p className="text-text-muted text-center py-16">Loading articles…</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-text-muted py-20">{SITE.blog.emptyMessage}</p>
      ) : (
        <ul className="space-y-8">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                className="block group rounded-2xl border border-primary/10 bg-bg-card p-6 hover:border-primary/25 hover:shadow-md transition-all"
              >
                <h2 className="text-xl font-bold text-primary group-hover:text-primary-hover font-serif">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-2 text-sm text-text-muted line-clamp-2">{post.excerpt}</p>
                )}
                <p className="mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  <Calendar className="w-3 h-3" />
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString()
                    : new Date(post.createdAt).toLocaleDateString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );

  if (withSidebar) {
    return (
      <div>
        <h1 className="text-2xl font-bold font-serif text-primary mb-2">{SITE.blog.pageTitle}</h1>
        {listContent}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main">
      <header className="border-b border-primary/10 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover"
          >
            <ArrowLeft className="w-4 h-4" />
            {SITE.navigation.backToHome}
          </Link>
          <h1 className="text-lg font-bold font-serif text-primary">{SITE.blog.pageTitle}</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-12">{listContent}</main>
    </div>
  );
}
