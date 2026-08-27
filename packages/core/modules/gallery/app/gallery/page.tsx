"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { SITE } from "@/constants";
import { buildPageMetadata } from "@/lib/seo/metadata";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  description?: string | null;
  imageUrl: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/gallery");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setItems(json.data);
        }
      } catch (err) {
        console.warn("Gallery page: failed to load", err);
      }
    }
    load();
  }, []);

  const categories = Array.from(new Set(items.map((i) => i.category))).sort();
  const filtered =
    filter === "all" ? items : items.filter((i) => i.category === filter);

  const closeLightbox = () => setLightboxIndex(null);
  const showPrev = () =>
    setLightboxIndex((idx) =>
      idx == null ? null : (idx - 1 + filtered.length) % filtered.length
    );
  const showNext = () =>
    setLightboxIndex((idx) =>
      idx == null ? null : (idx + 1) % filtered.length
    );

  return (
    <div className="min-h-screen bg-bg-main">
      <header className="border-b border-primary/10 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover"
          >
            <ArrowLeft className="w-4 h-4" />
            {SITE.navigation.backToHome}
          </Link>
          <h1 className="text-lg font-bold font-serif text-primary">{SITE.gallery.pageTitle}</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-text-muted text-sm mb-8 max-w-2xl">{SITE.gallery.pageSubtitle}</p>

        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                filter === "all"
                  ? "bg-primary text-white"
                  : "bg-white border border-primary/10 text-text-muted hover:text-primary"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                  filter === cat
                    ? "bg-primary text-white"
                    : "bg-white border border-primary/10 text-text-muted hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <p className="text-center text-text-muted py-20">{SITE.gallery.emptyMessage}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-primary/5 shadow-sm cursor-pointer"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <span className="text-white text-xs font-semibold line-clamp-1">{item.title}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {lightboxIndex != null && filtered[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="absolute top-6 right-6 text-white/80 hover:text-white"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            type="button"
            className="absolute left-4 md:left-8 text-white/80 hover:text-white p-2"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Previous"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <div className="relative max-w-5xl w-full max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={filtered[lightboxIndex].imageUrl}
              alt={filtered[lightboxIndex].title}
              width={1200}
              height={800}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
            <p className="text-white text-center mt-4 font-semibold">{filtered[lightboxIndex].title}</p>
          </div>
          <button
            type="button"
            className="absolute right-4 md:right-8 text-white/80 hover:text-white p-2"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Next"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}
    </div>
  );
}
