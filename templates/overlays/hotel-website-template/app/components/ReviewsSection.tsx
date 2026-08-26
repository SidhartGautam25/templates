"use client";

import React, { useEffect, useState } from "react";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { defaultReviews } from "@/constants/default-reviews";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<any[]>(
    defaultReviews.map((rev) => ({
      id: rev.id,
      name: rev.name,
      otherInfo: rev.otherInfo,
      description: rev.description,
      sortOrder: rev.sortOrder,
    }))
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch("/api/reviews");
        const json = await res.json();

        if (
          json.success &&
          Array.isArray(json.data) &&
          json.data.length > 0
        ) {
          setReviews(json.data);
        }
      } catch (err) {
        console.warn(
          "Failed to load reviews, using fallback:",
          err
        );
      }
    }

    loadReviews();
  }, []);

  useEffect(() => {
    if (reviews.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex(
        (prev) => (prev + 1) % reviews.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  if (reviews.length === 0) return null;

  const activeReview = reviews[activeIndex];

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + reviews.length) % reviews.length
    );
  };

  const handleNext = () => {
    setActiveIndex(
      (prev) => (prev + 1) % reviews.length
    );
  };

  return (
    <section className="relative overflow-hidden py-24 md:py-28">

      {/* =====================================================
          LIGHT ARCHITECTURAL BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0 bg-bg-light" />

      {/* Soft green / gold atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_25%,color-mix(in_srgb,var(--accent-gold)_10%,transparent),transparent_32%),radial-gradient(circle_at_92%_70%,color-mix(in_srgb,var(--primary)_9%,transparent),transparent_36%),linear-gradient(135deg,var(--bg-light)_0%,color-mix(in_srgb,var(--bg-light)_96%,var(--primary))_50%,color-mix(in_srgb,var(--bg-light)_94%,var(--accent-gold))_100%)]" />

      {/* Very subtle brick / stone texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              color-mix(in srgb, var(--primary) 40%, transparent) 1px,
              transparent 1px
            ),
            linear-gradient(
              color-mix(in srgb, var(--primary) 40%, transparent) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "96px 48px",
        }}
      />

      {/* Offset seams */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              transparent 47px,
              color-mix(in srgb, var(--accent-gold) 70%, transparent) 48px,
              transparent 49px
            )
          `,
          backgroundSize: "96px 48px",
          backgroundPosition: "48px 24px",
        }}
      />

      {/* Soft light */}
      <div className="pointer-events-none absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-accent-gold/8 blur-[120px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-primary/7 blur-[130px]" />

      {/* Section separators */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-gold/25 to-transparent" />

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">

        {/* HEADER */}
        <div className="mb-14 flex flex-col items-center text-center">

          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-accent-gold" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-accent-gold-dark">
              Guest Experiences
            </span>

            <span className="h-px w-10 bg-accent-gold" />
          </div>

          <h2 className="font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-primary md:text-5xl lg:text-[54px]">
            Words from our guests
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-text-muted md:text-base">
            The moments that stay with us long after the journey ends.
          </p>
        </div>

        {/* =====================================================
            REVIEW CARD
        ====================================================== */}

        <div className="relative mx-auto max-w-5xl">

          {/* Gold architectural outer frame */}
          <div className="absolute -inset-3 rounded-[30px] border border-accent-gold/20" />

          {/* White inner frame */}
          <div className="absolute -inset-[1px] rounded-[25px] border border-white/80" />

          <div className="relative overflow-hidden rounded-[24px] border border-primary/10 bg-bg-card/90 shadow-[0_25px_70px_-30px_rgba(61,90,82,0.3)] backdrop-blur-sm">

            {/* Decorative quote */}
            <div className="pointer-events-none absolute right-7 top-5 opacity-[0.055]">
              <Quote className="h-36 w-36 fill-primary text-primary" />
            </div>

            <div className="grid min-h-[390px] lg:grid-cols-[0.72fr_1.65fr]">

              {/* =================================================
                  GUEST INFORMATION
              ================================================== */}

              <div className="relative flex flex-col justify-between border-b border-primary/10 bg-footer-bg/45 p-8 md:p-10 lg:border-b-0 lg:border-r lg:p-12">

                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-accent-gold/30 bg-accent-gold/10">
                    <Quote className="h-5 w-5 text-accent-gold-dark" />
                  </div>

                  <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.25em] text-text-muted">
                    Guest review
                  </p>
                </div>

                <div className="mt-10 lg:mt-0">

                  <div className="mb-5 flex gap-1">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className="h-4 w-4 fill-accent-gold text-accent-gold"
                      />
                    ))}
                  </div>

                  <p className="font-serif text-xl text-primary md:text-2xl">
                    {activeReview.name}
                  </p>

                  {activeReview.otherInfo && (
                    <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-text-muted">
                      {activeReview.otherInfo}
                    </p>
                  )}
                </div>
              </div>

              {/* =================================================
                  REVIEW
              ================================================== */}

              <div className="flex flex-col justify-between p-8 md:p-10 lg:p-12">

                <div className="max-w-2xl">

                  <span className="font-serif text-5xl leading-none text-accent-gold">
                    “
                  </span>

                  <blockquote
                    key={activeReview.id}
                    className="mt-3 font-serif text-xl font-light leading-[1.65] text-primary md:text-2xl lg:text-[27px]"
                  >
                    {activeReview.description}
                  </blockquote>

                </div>

                {/* Bottom controls */}
                <div className="mt-10 flex items-center justify-between gap-6">

                  {/* Progress */}
                  <div className="flex items-center gap-4">

                    <span className="font-serif text-sm text-primary">
                      {String(activeIndex + 1).padStart(2, "0")}
                    </span>

                    <div className="relative h-px w-24 bg-primary/10 md:w-40">
                      <div
                        className="absolute left-0 top-0 h-px bg-accent-gold transition-all duration-500"
                        style={{
                          width: `${((activeIndex + 1) /
                              reviews.length) *
                            100
                            }%`,
                        }}
                      />
                    </div>

                    <span className="text-[10px] tracking-widest text-text-muted">
                      {String(reviews.length).padStart(2, "0")}
                    </span>

                  </div>

                  {/* Arrows */}
                  {reviews.length > 1 && (
                    <div className="flex items-center gap-2">

                      <button
                        onClick={handlePrev}
                        aria-label="Previous review"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/10 bg-bg-card text-primary transition-all hover:border-primary/20 hover:bg-primary hover:text-white"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <button
                        onClick={handleNext}
                        aria-label="Next review"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/10 bg-bg-card text-primary transition-all hover:border-primary/20 hover:bg-primary hover:text-white"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>

                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            BOTTOM DETAILS
        ====================================================== */}

        <div className="mt-10 grid items-center gap-6 sm:grid-cols-3">

          <div className="flex items-center gap-4">
            <span className="h-px w-8 bg-accent-gold/60" />

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                Experience
              </p>

              <p className="mt-1 font-serif text-sm text-primary">
                Warm & memorable
              </p>
            </div>
          </div>

          <div className="hidden items-center justify-center gap-4 sm:flex">
            <span className="h-px w-8 bg-accent-gold/60" />

            <div className="text-center">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                Guest stories
              </p>

              <p className="mt-1 font-serif text-sm text-primary">
                {reviews.length} experiences
              </p>
            </div>

            <span className="h-px w-8 bg-accent-gold/60" />
          </div>

          <div className="flex items-center justify-end gap-4">
            <div className="text-right">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                Your stay
              </p>

              <p className="mt-1 font-serif text-sm text-primary">
                Make your own memory
              </p>
            </div>

            <span className="h-px w-8 bg-accent-gold/60" />
          </div>

        </div>
      </div>
    </section>
  );
}