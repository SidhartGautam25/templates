import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SITE } from "@/constants";
import BlogSidebar, { type BlogSidebarPost } from "./BlogSidebar";

export default function BlogShell({
  posts,
  children,
}: {
  posts: BlogSidebarPost[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-main">
      <header className="border-b border-primary/10 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover"
          >
            <ArrowLeft className="w-4 h-4" />
            {SITE.navigation.backToHome}
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-text-muted truncate">
            {SITE.blog.pageTitle}
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-10">
        <BlogSidebar posts={posts} />
        <main className="flex-1 min-w-0 max-w-3xl">{children}</main>
      </div>
    </div>
  );
}
