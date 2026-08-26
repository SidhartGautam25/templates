"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const GALLERY_IMAGES = [
  {
    src: "/hero/hero-image-1.avif",
    title: "The Resort",
    category: "The Experience",
    description:
      "A peaceful retreat surrounded by warm interiors, thoughtful details and a relaxed atmosphere.",
  },
  {
    src: "/hero/hero-image-2.jpg",
    title: "Elegant Interiors",
    category: "Stay",
    description:
      "Comfortable spaces designed with a balance of contemporary style and timeless warmth.",
  },
  {
    src: "/hero/hero-image-3.jpg",
    title: "Dining & Living",
    category: "Experience",
    description:
      "Inviting spaces made for slow mornings, long conversations and memorable evenings.",
  },
  {
    src: "/hero/hero-image-4.jpg",
    title: "Premium Stay",
    category: "Rooms",
    description:
      "Relax into beautifully appointed rooms created for a comfortable and restful stay.",
  },
  {
    src: "/hero/family-delux-triple-bed-room-3.jpg",
    title: "Family Rooms",
    category: "Accommodation",
    description:
      "Spacious rooms where families can settle in, relax and enjoy their time together.",
  },
  {
    src: "/hero/room-1.avif",
    title: "Private Retreat",
    category: "Accommodation",
    description:
      "A quiet personal space designed to make every moment of your stay feel effortless.",
  },
];

export default function GallerySection() {
  const [centerIdx, setCenterIdx] = useState(1);

  const total = GALLERY_IMAGES.length;

  const previousIdx = (centerIdx - 1 + total) % total;
  const nextIdx = (centerIdx + 1) % total;

  const current = GALLERY_IMAGES[centerIdx];
  const previous = GALLERY_IMAGES[previousIdx];
  const next = GALLERY_IMAGES[nextIdx];

  const handlePrev = () => {
    setCenterIdx((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCenterIdx((prev) => (prev + 1) % total);
  };

  return (
    <section className="relative overflow-hidden py-24 md:py-28">

      {/* =========================================================
          ARCHITECTURAL BACKGROUND
      ========================================================== */}

      <div className="absolute inset-0 bg-bg-light" />

      {/* Large warm/green atmospheric gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,color-mix(in_srgb,var(--accent-gold)_14%,transparent),transparent_34%),radial-gradient(circle_at_85%_75%,color-mix(in_srgb,var(--primary)_13%,transparent),transparent_38%),linear-gradient(135deg,color-mix(in_srgb,var(--bg-light)_94%,var(--accent-gold))_0%,var(--bg-light)_45%,color-mix(in_srgb,var(--bg-light)_94%,var(--primary))_100%)]" />

      {/* Subtle brick / stone pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.075]"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              color-mix(in srgb, var(--primary) 35%, transparent) 1px,
              transparent 1px
            ),
            linear-gradient(
              color-mix(in srgb, var(--primary) 35%, transparent) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "92px 46px",
        }}
      />

      {/* Offset brick seams */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              transparent 45px,
              color-mix(in srgb, var(--accent-gold) 60%, transparent) 46px,
              transparent 47px
            )
          `,
          backgroundSize: "92px 46px",
          backgroundPosition: "46px 23px",
        }}
      />

      {/* Soft light patches */}
      <div className="pointer-events-none absolute -left-32 top-24 h-[520px] w-[520px] rounded-full bg-accent-gold/10 blur-[110px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />

      {/* Fine top/bottom architectural lines */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

      {/* =========================================================
          CONTENT
      ========================================================== */}

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">

        {/* HEADER */}
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-accent-gold" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-accent-gold-dark">
                Discover Chanakya Resort
              </span>
            </div>

            <h2 className="font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-primary md:text-5xl lg:text-[58px]">
              Take a look around
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-text-muted md:text-base">
              From peaceful rooms to inviting common spaces, discover the
              details that make your stay feel warm, comfortable and memorable.
            </p>
          </div>

          <div className="hidden items-center gap-5 md:flex">
            <div className="text-right">
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-text-muted">
                Our spaces
              </p>

              <p className="mt-1 font-serif text-lg text-primary">
                {String(total).padStart(2, "0")}{" "}
                <span className="text-accent-gold">+</span>
              </p>
            </div>

            <div className="h-12 w-px bg-primary/10" />

            <Link
              href="/gallery"
              className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:text-accent-gold-dark"
            >
              View gallery

              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* GALLERY */}
        <div className="relative mt-14 lg:mt-16">

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.25fr)_minmax(0,1fr)] lg:items-center lg:gap-12 xl:gap-16">

            {/* LEFT IMAGE */}
            <button
              onClick={handlePrev}
              className="group relative hidden aspect-[4/3] overflow-hidden rounded-[18px] border border-white/70 bg-bg-card/50 shadow-lg lg:block"
            >
              <Image
                src={previous.src}
                alt={previous.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="25vw"
              />

              <div className="absolute inset-0 bg-primary/45 transition duration-500 group-hover:bg-primary/20" />

              <div className="absolute bottom-6 left-6">
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/60">
                  Previous
                </p>

                <p className="mt-1 font-serif text-lg text-white">
                  {previous.title}
                </p>
              </div>
            </button>

            {/* =================================================
                CENTER IMAGE + FRAME
            ================================================= */}

            <div className="relative">

              {/* Outer architectural frame */}
              <div className="absolute -inset-[7px] rounded-[29px] border border-accent-gold/35" />

              {/* Inner architectural frame */}
              <div className="absolute -inset-[2px] rounded-[24px] border border-white/80" />

              {/* Corner details */}
              <div className="pointer-events-none absolute -left-3 -top-3 z-20 h-8 w-8 border-l border-t border-accent-gold/70" />

              <div className="pointer-events-none absolute -right-3 -top-3 z-20 h-8 w-8 border-r border-t border-accent-gold/70" />

              <div className="pointer-events-none absolute -bottom-3 -left-3 z-20 h-8 w-8 border-b border-l border-accent-gold/70" />

              <div className="pointer-events-none absolute -bottom-3 -right-3 z-20 h-8 w-8 border-b border-r border-accent-gold/70" />

              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] bg-primary shadow-[0_30px_80px_-25px_rgba(61,90,82,0.45)]">

                <Image
                  key={current.src}
                  src={current.src}
                  alt={current.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-primary/5 to-transparent" />

                {/* Category */}
                <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/20 bg-primary/25 px-4 py-2 backdrop-blur-md">
                  <Sparkles className="h-3 w-3 text-accent-gold-light" />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
                    {current.category}
                  </span>
                </div>

                {/* Counter */}
                <div className="absolute right-6 top-6">
                  <span className="font-serif text-sm text-white/90">
                    {String(centerIdx + 1).padStart(2, "0")}
                  </span>

                  <span className="mx-1 text-white/40">/</span>

                  <span className="text-[10px] text-white/60">
                    {String(total).padStart(2, "0")}
                  </span>
                </div>

                {/* Main content */}
                <div className="absolute bottom-7 left-7 right-7">
                  <h3 className="font-serif text-2xl font-medium text-white md:text-3xl lg:text-4xl">
                    {current.title}
                  </h3>

                  <p className="mt-2 max-w-lg text-xs leading-5 text-white/75 md:text-sm">
                    {current.description}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <button
                onClick={handlePrev}
                aria-label="Previous image"
                className="absolute -left-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary/10 bg-bg-card text-primary shadow-xl transition-all hover:scale-105 hover:bg-primary hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={handleNext}
                aria-label="Next image"
                className="absolute -right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary/10 bg-bg-card text-primary shadow-xl transition-all hover:scale-105 hover:bg-primary hover:text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* RIGHT IMAGE */}
            <button
              onClick={handleNext}
              className="group relative hidden aspect-[4/3] overflow-hidden rounded-[18px] border border-white/70 bg-bg-card/50 shadow-lg lg:block"
            >
              <Image
                src={next.src}
                alt={next.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="25vw"
              />

              <div className="absolute inset-0 bg-primary/45 transition duration-500 group-hover:bg-primary/20" />

              <div className="absolute bottom-6 right-6 text-right">
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/60">
                  Next
                </p>

                <p className="mt-1 font-serif text-lg text-white">
                  {next.title}
                </p>
              </div>
            </button>
          </div>

          {/* BOTTOM INFORMATION */}
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center">

            <div className="hidden lg:block">
              <p className="max-w-sm text-xs leading-6 text-text-muted">
                Every corner has been thoughtfully designed to give you a
                relaxed place to unwind, reconnect and enjoy your time away.
              </p>
            </div>

            {/* Progress */}
            <div className="flex items-center justify-center gap-4">
              <span className="font-serif text-sm text-primary">
                {String(centerIdx + 1).padStart(2, "0")}
              </span>

              <div className="relative h-px w-32 bg-primary/10 md:w-44">
                <div
                  className="absolute left-0 top-0 h-px bg-accent-gold transition-all duration-500"
                  style={{
                    width: `${((centerIdx + 1) / total) * 100}%`,
                  }}
                />
              </div>

              <span className="text-[10px] tracking-widest text-text-muted">
                {String(total).padStart(2, "0")}
              </span>
            </div>

            {/* CTA */}
            <div className="flex justify-center lg:justify-end">
              <Link
                href="/gallery"
                className="group inline-flex items-center gap-2 rounded-full border border-primary/15 bg-bg-card/80 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary shadow-sm backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-primary hover:text-white"
              >
                Explore all spaces

                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}