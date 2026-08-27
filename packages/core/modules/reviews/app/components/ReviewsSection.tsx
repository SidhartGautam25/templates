"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { SITE } from "@/constants";

interface ReviewItem {
  id: string;
  name: string;
  otherInfo?: string | null;
  description: string;
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/reviews");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setReviews(json.data);
        }
      } catch (err) {
        console.warn("ReviewsSection: failed to load", err);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  if (reviews.length === 0) return null;

  const active = reviews[activeIndex];

  return (
    <section className="py-20 md:py-24 bg-white border-t border-primary/5">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="text-[10px] font-extrabold tracking-[0.25em] uppercase text-accent-gold-dark">
          {SITE.reviews.sectionEyebrow}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold font-serif text-primary mt-2">
          {SITE.reviews.sectionTitle}
        </h2>
        <p className="text-sm text-text-muted mt-2 mb-10">{SITE.reviews.sectionSubtitle}</p>

        <div className="relative bg-bg-light rounded-3xl p-8 md:p-12 border border-primary/5 shadow-sm">
          <Quote className="w-8 h-8 text-accent-gold/40 mx-auto mb-4" />
          <p className="text-base md:text-lg text-text-main leading-relaxed font-medium">
            {active.description}
          </p>
          <div className="mt-6 flex flex-col items-center gap-1">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent-gold text-accent-gold" />
              ))}
            </div>
            <p className="font-bold text-primary mt-2">{active.name}</p>
            {active.otherInfo && (
              <p className="text-xs text-text-muted">{active.otherInfo}</p>
            )}
          </div>

          {reviews.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                type="button"
                onClick={() => setActiveIndex((i) => (i - 1 + reviews.length) % reviews.length)}
                className="p-2 rounded-full border border-primary/10 hover:bg-white cursor-pointer"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-5 h-5 text-primary" />
              </button>
              <span className="text-xs text-text-muted font-medium">
                {activeIndex + 1} / {reviews.length}
              </span>
              <button
                type="button"
                onClick={() => setActiveIndex((i) => (i + 1) % reviews.length)}
                className="p-2 rounded-full border border-primary/10 hover:bg-white cursor-pointer"
                aria-label="Next review"
              >
                <ChevronRight className="w-5 h-5 text-primary" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
