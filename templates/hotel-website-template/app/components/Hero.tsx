"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  MapPin,
  Sparkles,
  ShieldCheck,
  Tag,
  Calendar,
  Download,
  Phone,
  ArrowRight,
} from "lucide-react";
import { SITE } from "@/constants";

interface HeroProps {
  onOpenEnquiry: (projectName?: string) => void;
}

const featureIcons = {
  map: MapPin,
  sparkles: Sparkles,
  shield: ShieldCheck,
  tag: Tag,
} as const;

const heroCarouselImages = SITE.hero.carouselImages || [
  "/hero/hero-image-1.avif",
  "/hero/hero-image-2.jpg",
  "/hero/hero-image-3.jpg",
  "/hero/hero-image-4.jpg",
];

const SLIDE_DURATION = SITE.hero.slideDuration || 5000;

export default function Hero({ onOpenEnquiry }: HeroProps) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex(
        (prev) => (prev + 1) % heroCarouselImages.length
      );
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, []);

  const badgeFeature = SITE.hero.features[0];

  const BadgeIcon = badgeFeature
    ? featureIcons[
    badgeFeature.icon as keyof typeof featureIcons
    ] || Sparkles
    : Sparkles;

  const badgeFeature2 = SITE.hero.features[1];

  const BadgeIcon2 = badgeFeature2
    ? featureIcons[
    badgeFeature2.icon as keyof typeof featureIcons
    ] || ShieldCheck
    : ShieldCheck;

  const locationsCount = SITE.hero.locations?.length || 0;

  const nextIndex =
    (carouselIndex + 1) % heroCarouselImages.length;

  const handleFrameMouseMove = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const px =
      (e.clientX - rect.left) / rect.width - 0.5;

    const py =
      (e.clientY - rect.top) / rect.height - 0.5;

    setTilt({
      x: py * -7,
      y: px * 9,
    });
  };

  const handleFrameMouseLeave = () =>
    setTilt({ x: 0, y: 0 });

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden bg-bg-light px-6 py-28 hero-gradient md:px-16 lg:flex-row lg:h-screen lg:items-center lg:px-24 lg:py-0">
      {/* =========================================================
          EXISTING DESKTOP/THEME BACKGROUND
          PRESERVED
      ========================================================== */}

      <div className="absolute inset-0 z-0 bg-bg-tan/20 opacity-60 pointer-events-none" />

      <div
        className="hero-panel-pulse absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-primary/18 via-primary/8 to-transparent"
        style={{
          clipPath:
            "polygon(0 0, 64% 0, 38% 100%, 0 100%)",
        }}
      />

      <div
        className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-tr from-primary/10 via-transparent to-transparent"
        style={{
          clipPath:
            "polygon(0 0, 64% 0, 38% 100%, 0 100%)",
        }}
      />

      <div className="absolute top-0 left-0 right-0 h-[3px] z-30 bg-gradient-to-r from-primary via-accent-gold to-primary pointer-events-none" />

      <div className="hero-blob hero-blob-a absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-primary/25 blur-3xl pointer-events-none" />

      <div className="hero-blob hero-blob-b absolute -bottom-40 -right-16 w-[32rem] h-[32rem] rounded-full bg-accent-gold/20 blur-3xl pointer-events-none" />

      <div className="hero-blob hero-blob-c absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

      <svg
        className="absolute inset-0 z-0 w-full h-full text-primary/[0.14] pointer-events-none"
        style={{
          maskImage:
            "radial-gradient(ellipse 65% 55% at 15% 25%, black 0%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 55% at 15% 25%, black 0%, transparent 72%)",
        }}
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="heroBoxGrid"
            width="44"
            height="44"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 44 0 L 0 0 0 44"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect
          width="100%"
          height="100%"
          fill="url(#heroBoxGrid)"
        />
      </svg>

      <div
        className="absolute inset-0 z-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 80% 75%, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 80% 75%, black 0%, transparent 70%)",
        }}
      />

      {/* =========================================================
          MOBILE VISUAL
          ONLY VISIBLE BELOW lg
      ========================================================== */}

      <div className="relative z-20 mx-auto mb-12 w-full max-w-7xl lg:hidden">

        <div className="relative mx-auto w-full max-w-[520px] px-2 pb-8">

          {/* Ambient glow */}
          <div className="absolute left-1/2 top-1/2 -z-10 aspect-[4/3] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-[3rem] bg-primary/20 blur-3xl" />

          {/* Gold corner details */}
          <div className="absolute -left-1 top-0 z-30 h-12 w-12 rounded-tl-2xl border-l-2 border-t-2 border-accent-gold/70" />

          <div className="absolute -right-1 top-0 z-30 h-12 w-12 rounded-tr-2xl border-r-2 border-t-2 border-accent-gold/70" />

          {/* Main image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-[26px] border-4 border-white bg-bg-tan shadow-2xl">

            {heroCarouselImages.map((src, idx) => (
              <Image
                key={src}
                src={src}
                alt={`Resort View ${idx + 1}`}
                fill
                priority={idx === 0}
                sizes="100vw"
                className={`object-cover transition-opacity duration-1000 ease-in-out ${idx === carouselIndex
                  ? "opacity-100 hero-kenburns"
                  : "opacity-0"
                  }`}
              />
            ))}

            {/* Cinematic overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent pointer-events-none" />

            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-transparent pointer-events-none" />

            {/* Feature */}
            {badgeFeature && (
              <div className="absolute left-4 top-4 z-30 flex items-center gap-2 rounded-full border border-white/30 bg-white/90 px-3 py-2 shadow-lg backdrop-blur-md">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-gold/20">
                  <BadgeIcon className="h-3.5 w-3.5 text-accent-gold-dark" />
                </span>

                <span className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-primary">
                  {badgeFeature.label}
                </span>
              </div>
            )}

            {/* Counter */}
            <div className="absolute right-4 top-4 z-30 rounded-full border border-white/20 bg-primary/40 px-3 py-1.5 backdrop-blur-md">
              <span className="font-serif text-xs text-white">
                {String(carouselIndex + 1).padStart(2, "0")}
              </span>

              <span className="mx-1 text-white/40">
                /
              </span>

              <span className="text-[9px] tracking-widest text-white/70">
                {String(
                  heroCarouselImages.length
                ).padStart(2, "0")}
              </span>
            </div>

            {/* Bottom title */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-5 pb-7">
              <span className="mb-1 block text-[8px] font-bold uppercase tracking-[0.28em] text-accent-gold-light">
                {SITE.brand.shortName}
              </span>

              <h2 className="font-serif text-2xl font-medium leading-tight text-white">
                A stay worth remembering
              </h2>
            </div>

            {/* Progress */}
            <div className="absolute bottom-3 left-1/2 z-30 flex w-[62%] -translate-x-1/2 gap-1.5">
              {heroCarouselImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    setCarouselIndex(idx)
                  }
                  aria-label={`Go to slide ${idx + 1
                    }`}
                  className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/35"
                >
                  {idx === carouselIndex && (
                    <span
                      key={carouselIndex}
                      className="hero-progress absolute inset-y-0 left-0 rounded-full bg-white"
                    />
                  )}

                  {idx < carouselIndex && (
                    <span className="absolute inset-0 rounded-full bg-white/80" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Floating next preview */}
          <button
            onClick={() =>
              setCarouselIndex(nextIndex)
            }
            aria-label="View next resort image"
            className="hero-mobile-preview absolute -bottom-3 left-5 z-40 aspect-[4/3] w-[29%] -rotate-6 overflow-hidden rounded-2xl border-4 border-white bg-bg-card shadow-xl"
          >
            <Image
              src={heroCarouselImages[nextIndex]}
              alt="Next resort view"
              fill
              sizes="30vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-primary/15" />

            <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[7px] font-extrabold uppercase tracking-wider text-primary shadow">
              <ArrowRight className="h-2.5 w-2.5" />
              Next
            </span>
          </button>

          {/* Location chip */}
          {locationsCount > 0 && (
            <div className="hero-mobile-stat absolute -bottom-3 right-4 z-40 flex h-[68px] w-[68px] rotate-3 flex-col items-center justify-center rounded-2xl bg-primary text-white shadow-xl">
              <span className="font-serif text-xl font-extrabold leading-none">
                {locationsCount}+
              </span>

              <span className="mt-1 px-1 text-center text-[6px] font-extrabold uppercase leading-tight tracking-widest text-white/80">
                Prime Locations
              </span>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          ORIGINAL MAIN GRID
          IMPORTANT:
          THIS IS THE DESKTOP STRUCTURE FROM YOUR ORIGINAL CODE.
      ========================================================== */}

      <div className="relative z-20 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

        {/* =======================================================
            LEFT SIDE
            ORIGINAL DESKTOP CODE
        ======================================================== */}

        <div className="lg:col-span-6 flex flex-col items-start space-y-6">

          <span
            className={`hero-fade-up inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 backdrop-blur-sm px-3.5 py-1.5 text-primary font-extrabold text-[10px] md:text-xs tracking-[0.25em] uppercase font-sans shadow-sm ${mounted ? "hero-fade-up-in" : ""
              }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-accent-gold" />

            {SITE.hero.eyebrow}
          </span>

          <h1
            className={`hero-fade-up hero-fade-up-delay-1 text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight font-serif leading-[1.08] bg-gradient-to-br from-primary via-primary to-accent-gold-dark bg-clip-text text-transparent [text-wrap:balance] ${mounted ? "hero-fade-up-in" : ""
              }`}
          >
            {SITE.hero.headline}
          </h1>

          <p
            className={`hero-fade-up hero-fade-up-delay-2 text-text-main/90 text-xs sm:text-sm md:text-base leading-relaxed font-medium max-w-xl ${mounted ? "hero-fade-up-in" : ""
              }`}
          >
            {SITE.hero.subheadline}
          </p>

          <div
            className={`hero-fade-up hero-fade-up-delay-3 flex flex-wrap items-center gap-2.5 pt-1 w-full ${mounted ? "hero-fade-up-in" : ""
              }`}
          >
            {SITE.hero.features.map((feature) => {
              const Icon =
                featureIcons[
                feature.icon as keyof typeof featureIcons
                ] || Sparkles;

              return (
                <div
                  key={feature.label}
                  className="group flex items-center gap-2 rounded-full border border-primary/10 bg-white/60 backdrop-blur-sm pl-2 pr-3.5 py-2 shadow-sm transition-all duration-300 hover:bg-white hover:border-primary/25 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-gold/15 group-hover:bg-accent-gold/25 transition-colors">
                    <Icon className="w-3.5 h-3.5 text-accent-gold-dark" />
                  </span>

                  <span className="text-[10px] font-extrabold tracking-wider uppercase text-text-main">
                    {feature.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div
            className={`hero-fade-up hero-fade-up-delay-3 flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto pt-2 ${mounted ? "hero-fade-up-in" : ""
              }`}
          >
            {SITE.hero.ctaButtons.map((cta) => {
              const isPrimary =
                cta.label.includes("Book");

              return (
                <button
                  key={cta.label}
                  onClick={() =>
                    onOpenEnquiry(cta.enquiryLabel)
                  }
                  className={
                    isPrimary
                      ? "hero-shine group relative overflow-hidden w-full sm:w-auto justify-center px-6 py-3.5 bg-primary hover:bg-primary-hover text-white font-extrabold text-[10px] uppercase tracking-widest rounded-lg transition-all duration-300 shadow-lg shadow-primary/25 flex items-center space-x-2 cursor-pointer hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/30"
                      : "group relative w-full sm:w-auto justify-center px-6 py-3.5 bg-white/80 hover:bg-white text-primary border border-primary/20 hover:border-primary/40 font-extrabold text-[10px] uppercase tracking-widest rounded-lg transition-all duration-300 flex items-center space-x-2 cursor-pointer shadow-sm hover:scale-[1.03] hover:shadow-md"
                  }
                >
                  {cta.label.includes("Book") ? (
                    <Calendar className="w-3.5 h-3.5" />
                  ) : cta.label.includes("Brochure") ? (
                    <Download className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
                  ) : (
                    <Phone className="w-3.5 h-3.5 text-accent-gold" />
                  )}

                  <span>{cta.label}</span>

                  {isPrimary && (
                    <ArrowRight className="w-3.5 h-3.5 -ml-1 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  )}
                </button>
              );
            })}
          </div>

          <div
            className={`hero-fade-up hero-fade-up-delay-4 glass-card-light rounded-xl p-4 md:p-5 w-full max-w-xl shadow-sm border border-white/60 ${mounted ? "hero-fade-up-in" : ""
              }`}
          >
            <span className="block text-[9px] font-extrabold tracking-widest text-accent-gold-dark uppercase mb-2.5">
              {SITE.hero.locationsTitle}
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {SITE.hero.locations.map((loc) => (
                <button
                  key={loc.label}
                  className="group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-text-main bg-bg-tan/40 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer"
                  onClick={() =>
                    onOpenEnquiry(loc.enquiryLabel)
                  }
                >
                  <MapPin className="w-3 h-3 text-accent-gold group-hover:text-white" />

                  <span>{loc.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* =======================================================
            RIGHT SIDE
            ORIGINAL DESKTOP VISUAL
        ======================================================== */}

        <div className="lg:col-span-6 w-full flex items-center justify-center">

          <div
            className={`hero-fade-in relative w-full pb-10 pr-8 sm:pb-14 sm:pr-14 ${mounted ? "hero-fade-in-in" : ""
              }`}
          >

            {/* Ambient shadow */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] aspect-[4/3] rounded-[3rem] bg-primary/15 blur-3xl -z-10" />

            {/* Vertical label */}
            <span className="hidden lg:flex absolute -left-3 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 text-[10px] font-extrabold tracking-[0.35em] uppercase text-primary/50 select-none">
              {SITE.hero.eyebrow}
            </span>

            {/* Gold viewfinder */}
            <div className="hidden sm:block absolute -top-4 -right-2 w-14 h-14 border-t-2 border-r-2 border-accent-gold rounded-tr-2xl pointer-events-none" />

            {/* Orbit */}
            <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[112%] aspect-square rounded-full border border-dashed border-primary/25 pointer-events-none -z-10" />

            <div className="hero-orbit hidden md:block absolute left-1/2 top-1/2 w-[112%] aspect-square -z-10 pointer-events-none">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-accent-gold shadow" />
            </div>

            {/* Dot cluster */}
            <div className="hidden sm:flex absolute -top-6 left-8 items-end gap-1.5 pointer-events-none">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-gold/70" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              <span className="w-1 h-1 rounded-full bg-primary/25" />
            </div>

            {/* Plus */}
            <span className="hidden md:block absolute top-10 -right-8 text-2xl font-serif text-accent-gold/60 rotate-12 select-none pointer-events-none">
              +
            </span>

            {/* Main frame */}
            <div
              onMouseMove={handleFrameMouseMove}
              onMouseLeave={handleFrameMouseLeave}
              style={{
                transform: `perspective(1400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition:
                  "transform 0.25s ease-out",
                transformStyle: "preserve-3d",
              }}
              className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-bg-tan"
            >

              {heroCarouselImages.map((src, idx) => (
                <Image
                  key={src}
                  src={src}
                  alt={`Resort View ${idx + 1}`}
                  fill
                  priority={idx === 0}
                  className={`object-cover transition-opacity duration-1000 ease-in-out ${idx === carouselIndex
                    ? "opacity-100 hero-kenburns"
                    : "opacity-0"
                    }`}
                />
              ))}

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent pointer-events-none" />

              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent pointer-events-none" />

              {/* Sheen */}
              <div className="hero-sheen absolute inset-0 pointer-events-none" />

              {/* First badge */}
              {badgeFeature && (
                <div className="absolute top-4 left-4 z-30 flex items-center gap-2 rounded-full bg-white/85 backdrop-blur-md px-3.5 py-2 shadow-lg">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-gold/20">
                    <BadgeIcon className="w-3.5 h-3.5 text-accent-gold-dark" />
                  </span>

                  <span className="text-[9px] font-extrabold tracking-widest uppercase text-primary">
                    {badgeFeature.label}
                  </span>
                </div>
              )}

              {/* Second badge */}
              {badgeFeature2 && (
                <div className="hidden sm:flex absolute top-4 right-4 z-30 items-center gap-2 rounded-full bg-white/85 backdrop-blur-md px-3.5 py-2 shadow-lg">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-gold/20">
                    <BadgeIcon2 className="w-3.5 h-3.5 text-accent-gold-dark" />
                  </span>

                  <span className="text-[9px] font-extrabold tracking-widest uppercase text-primary">
                    {badgeFeature2.label}
                  </span>
                </div>
              )}

              {/* Progress */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30 w-2/3 max-w-[220px]">
                {heroCarouselImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      setCarouselIndex(idx)
                    }
                    title={`Go to slide ${idx + 1}`}
                    className="relative h-[3px] flex-1 rounded-full bg-white/35 overflow-hidden cursor-pointer"
                  >
                    {idx === carouselIndex && (
                      <span
                        key={carouselIndex}
                        className="hero-progress absolute inset-y-0 left-0 bg-white rounded-full"
                      />
                    )}

                    {idx < carouselIndex && (
                      <span className="absolute inset-0 bg-white/80 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <button
              onClick={() =>
                setCarouselIndex(nextIndex)
              }
              title="Next view"
              className="hero-float-tile hidden sm:block absolute -bottom-8 -left-6 w-[42%] aspect-[4/3] rounded-2xl overflow-hidden border-4 border-white shadow-xl -rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-500 cursor-pointer z-20"
            >
              <Image
                key={heroCarouselImages[nextIndex]}
                src={heroCarouselImages[nextIndex]}
                alt="Next resort view"
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/10" />

              <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[8px] font-extrabold tracking-widest uppercase text-primary shadow">
                <ArrowRight className="w-2.5 h-2.5" />
                Next
              </span>
            </button>

            {/* Location stat */}
            {locationsCount > 0 && (
              <div className="hero-float-chip hidden sm:flex absolute -bottom-6 -right-2 z-20 flex-col items-center justify-center w-20 h-20 rounded-2xl bg-primary text-white shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <span className="text-xl font-extrabold font-serif leading-none">
                  {locationsCount}+
                </span>

                <span className="text-[7px] font-extrabold tracking-widest uppercase text-white/80 mt-1 text-center px-1 leading-tight">
                  Prime Locations
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          ANIMATIONS
      ========================================================== */}

      <style>{`
        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroFadeIn {
          from {
            opacity: 0;
            transform: scale(0.97);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes heroKenBurns {
          from {
            transform: scale(1);
          }

          to {
            transform: scale(1.08);
          }
        }

        @keyframes heroProgress {
          from {
            width: 0%;
          }

          to {
            width: 100%;
          }
        }

        @keyframes heroFloatA {
          0%, 100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(20px, 30px);
          }
        }

        @keyframes heroFloatB {
          0%, 100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(-25px, -20px);
          }
        }

        @keyframes heroFloatC {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(-15px, 20px) scale(1.08);
          }
        }

        @keyframes heroPanelPulse {
          0%, 100% {
            opacity: 1;
          }

          50% {
            opacity: 0.72;
          }
        }

        @keyframes heroFloatTile {
          0%, 100% {
            transform: rotate(-6deg) translateY(0);
          }

          50% {
            transform: rotate(-6deg) translateY(-8px);
          }
        }

        @keyframes heroFloatChip {
          0%, 100% {
            transform: rotate(3deg) translateY(0);
          }

          50% {
            transform: rotate(3deg) translateY(-6px);
          }
        }

        @keyframes heroMobilePreview {
          0%, 100% {
            transform: rotate(-6deg) translateY(0);
          }

          50% {
            transform: rotate(-6deg) translateY(-6px);
          }
        }

        @keyframes heroMobileStat {
          0%, 100% {
            transform: rotate(3deg) translateY(0);
          }

          50% {
            transform: rotate(3deg) translateY(-5px);
          }
        }

        @keyframes heroSpin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes heroSheen {
          0% {
            transform: translateX(-120%) skewX(-20deg);
          }

          40%, 100% {
            transform: translateX(220%) skewX(-20deg);
          }
        }

        .hero-fade-up {
          opacity: 0;
        }

        .hero-fade-up-in {
          animation: heroFadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .hero-fade-up-delay-1.hero-fade-up-in {
          animation-delay: 0.08s;
        }

        .hero-fade-up-delay-2.hero-fade-up-in {
          animation-delay: 0.16s;
        }

        .hero-fade-up-delay-3.hero-fade-up-in {
          animation-delay: 0.24s;
        }

        .hero-fade-up-delay-4.hero-fade-up-in {
          animation-delay: 0.32s;
        }

        .hero-fade-in {
          opacity: 0;
        }

        .hero-fade-in-in {
          animation: heroFadeIn 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: 0.15s;
        }

        .hero-kenburns {
          animation: heroKenBurns ${SLIDE_DURATION * 1.4}ms ease-out forwards;
        }

        .hero-progress {
          animation: heroProgress ${SLIDE_DURATION}ms linear forwards;
        }

        .hero-blob-a {
          animation: heroFloatA 14s ease-in-out infinite;
        }

        .hero-blob-b {
          animation: heroFloatB 16s ease-in-out infinite;
        }

        .hero-blob-c {
          animation: heroFloatC 12s ease-in-out infinite;
        }

        .hero-panel-pulse {
          animation: heroPanelPulse 9s ease-in-out infinite;
        }

        .hero-float-tile {
          animation: heroFloatTile 6s ease-in-out infinite;
        }

        .hero-float-tile:hover {
          animation-play-state: paused;
        }

        .hero-float-chip {
          animation: heroFloatChip 5s ease-in-out infinite;
          animation-delay: 0.6s;
        }

        .hero-float-chip:hover {
          animation-play-state: paused;
        }

        .hero-mobile-preview {
          animation: heroMobilePreview 5s ease-in-out infinite;
        }

        .hero-mobile-preview:hover {
          animation-play-state: paused;
        }

        .hero-mobile-stat {
          animation: heroMobileStat 4.5s ease-in-out infinite;
        }

        .hero-orbit {
          animation: heroSpin 22s linear infinite;
        }

        .hero-sheen {
          background: linear-gradient(
            75deg,
            transparent 40%,
            rgba(255, 255, 255, 0.16) 50%,
            transparent 60%
          );

          animation: heroSheen 7s ease-in-out infinite;
        }

        .hero-shine::after {
          content: "";
          position: absolute;
          top: 0;
          left: -75%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.35),
            transparent
          );

          transform: skewX(-20deg);
          transition: left 0.7s ease;
        }

        .hero-shine:hover::after {
          left: 125%;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-fade-up-in,
          .hero-fade-in-in,
          .hero-kenburns,
          .hero-progress,
          .hero-blob-a,
          .hero-blob-b,
          .hero-float-tile,
          .hero-float-chip,
          .hero-mobile-preview,
          .hero-mobile-stat,
          .hero-orbit,
          .hero-sheen,
          .hero-blob-c,
          .hero-panel-pulse {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}