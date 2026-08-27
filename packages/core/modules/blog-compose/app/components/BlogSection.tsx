"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SITE } from "@/constants";

interface BlogCard {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
}

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogCard[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/blog-posts");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setPosts(json.data.slice(0, SITE.blog.homepageLimit));
        }
      } catch (err) {
        console.warn("BlogSection: failed to load", err);
      }
    }
    load();
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="py-16 px-6 md:px-12 bg-bg-light border-t border-primary/10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent-gold-dark">
              {SITE.blog.sectionEyebrow}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-primary mt-1">
              {SITE.blog.sectionTitle}
            </h2>
            {SITE.blog.sectionSubtitle && (
              <p className="text-sm text-text-muted mt-2 max-w-xl">{SITE.blog.sectionSubtitle}</p>
            )}
          </div>
          <Link
            href="/blog"
            className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-hover"
          >
            {SITE.blog.viewAllLabel}
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block rounded-2xl border border-primary/10 bg-bg-card p-5 hover:border-primary/25 hover:shadow-md transition-all"
            >
              <h3 className="font-bold text-primary font-serif line-clamp-2">{post.title}</h3>
              {post.excerpt && (
                <p className="mt-2 text-sm text-text-muted line-clamp-3">{post.excerpt}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
