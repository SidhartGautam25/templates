"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Images } from "lucide-react";
import { SITE } from "@/constants";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  description?: string | null;
  imageUrl: string;
}

export default function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/gallery");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setItems(json.data.slice(0, 6));
        }
      } catch (err) {
        console.warn("GallerySection: failed to load", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section className="py-20 md:py-24 bg-bg-light border-t border-primary/5">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <span className="text-[10px] font-extrabold tracking-[0.25em] uppercase text-accent-gold-dark">
              {SITE.gallery.sectionEyebrow}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-primary mt-2">
              {SITE.gallery.sectionTitle}
            </h2>
            <p className="text-sm text-text-muted mt-2 max-w-xl">{SITE.gallery.sectionSubtitle}</p>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-hover transition-colors"
          >
            {SITE.gallery.viewAllLabel}
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-bg-card/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-bg-card shadow-sm border border-primary/5"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-sm font-semibold">{item.title}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
