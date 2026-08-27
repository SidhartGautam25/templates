"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Sparkles, ShieldCheck, Tag, Calendar, Download, Phone } from "lucide-react";
import { SITE } from "@/constants";

interface HeroProps {
  onOpenEnquiry: (label?: string) => void;
}

const featureIcons = {
  map: MapPin,
  sparkles: Sparkles,
  shield: ShieldCheck,
  tag: Tag,
} as const;

export default function Hero({ onOpenEnquiry }: HeroProps) {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const desktopImages = SITE.assets.heroDesktop;
  const phoneImages = SITE.assets.heroMobile;
  const hasImages = desktopImages.length > 0 || phoneImages.length > 0;
  const slideCount = Math.max(desktopImages.length, phoneImages.length, 1);

  useEffect(() => {
    if (!hasImages || slideCount <= 1) return;

    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % slideCount);
    }, SITE.hero.slideDuration || 5000);

    return () => clearInterval(interval);
  }, [hasImages, slideCount]);

  return (
    <section className="relative min-h-screen md:h-screen w-full flex items-center justify-start px-6 md:px-16 lg:px-24 py-24 md:py-0 overflow-x-hidden bg-bg-light hero-gradient">
      <div className="absolute inset-0 z-0">
        {hasImages ? (
          <>
            <div className="hidden md:block absolute inset-0">
              {desktopImages.map((src, index) => (
                <Image
                  key={`desktop-${src}`}
                  src={src}
                  alt={`${SITE.brand.name} desktop`}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className={`object-cover object-center transition-opacity duration-1000 ease-in-out ${
                    index === currentBgIndex ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>

            <div className="block md:hidden absolute inset-0">
              {(phoneImages.length > 0 ? phoneImages : desktopImages).map((src, index) => (
                <Image
                  key={`phone-${src}`}
                  src={src}
                  alt={`${SITE.brand.name} mobile`}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className={`object-cover object-center transition-opacity duration-1000 ease-in-out ${
                    index === currentBgIndex ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>

            <div className="absolute inset-0 z-10 bg-white/30 md:bg-gradient-to-r md:from-white/80 md:via-white/50 md:to-white/20" />
          </>
        ) : (
          <div className="absolute inset-0 hero-gradient" />
        )}
      </div>

      <div className="relative z-20 w-full max-w-4xl mt-20 text-left flex flex-col items-start space-y-6">
        <span className="text-primary font-extrabold text-[10px] md:text-xs tracking-[0.25em] uppercase font-sans">
          {SITE.hero.eyebrow}
        </span>

        <h1 className="text-3xl sm:text-5xl md:text-[56px] font-extrabold tracking-tight font-serif text-primary max-w-3xl leading-tight">
          {SITE.hero.headline}
        </h1>

        <p className="text-text-main/90 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed font-medium">
          {SITE.hero.subheadline}
        </p>

        {SITE.hero.features.length > 0 && (
          <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 md:flex md:flex-wrap md:items-center md:gap-x-5 md:gap-y-2.5 pt-1 text-text-main w-full">
            {SITE.hero.features.map((feature, idx) => {
              const Icon = featureIcons[feature.icon as keyof typeof featureIcons] || Sparkles;
              return (
                <React.Fragment key={feature.label}>
                  {idx > 0 && <span className="text-primary/20 hidden md:inline">|</span>}
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-accent-gold flex-shrink-0" />
                    <span className="text-[10px] font-extrabold tracking-wider uppercase">{feature.label}</span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}

        {SITE.hero.ctaButtons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto pt-2">
            {SITE.hero.ctaButtons.map((cta) => (
              <button
                key={cta.label}
                onClick={() => onOpenEnquiry(cta.enquiryLabel)}
                className={
                  cta.label.toLowerCase().includes("book")
                    ? "w-full sm:w-auto justify-center px-5 py-3.5 bg-primary hover:bg-primary-hover text-white font-extrabold text-[10px] uppercase tracking-widest rounded-lg transition-all duration-300 shadow-md flex items-center space-x-2 cursor-pointer hover:scale-105"
                    : "w-full sm:w-auto justify-center px-5 py-3.5 bg-white/80 hover:bg-white text-primary border border-primary/20 hover:border-primary/40 font-extrabold text-[10px] uppercase tracking-widest rounded-lg transition-all duration-300 flex items-center space-x-2 cursor-pointer shadow-sm hover:scale-105"
                }
              >
                {cta.label.toLowerCase().includes("book") ? (
                  <Calendar className="w-3.5 h-3.5" />
                ) : cta.label.toLowerCase().includes("brochure") ? (
                  <Download className="w-3.5 h-3.5" />
                ) : (
                  <Phone className="w-3.5 h-3.5 text-accent-gold" />
                )}
                <span>{cta.label}</span>
              </button>
            ))}
          </div>
        )}

        {SITE.hero.locations.length > 0 && (
          <div className="glass-card-light rounded-xl p-4 md:p-5 w-full max-w-3xl mt-6 shadow-sm mb-8 sm:mb-0">
            <span className="block text-[9px] font-extrabold tracking-widest text-accent-gold-dark uppercase mb-2">
              {SITE.hero.locationsTitle}
            </span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 text-[11px] font-bold text-text-main">
              {SITE.hero.locations.map((loc, idx) => (
                <React.Fragment key={loc.label}>
                  {idx > 0 && <span className="text-primary/20 hidden sm:inline">|</span>}
                  <button
                    className="flex items-center space-x-1 hover:text-primary transition-colors cursor-pointer"
                    onClick={() => onOpenEnquiry(loc.enquiryLabel)}
                  >
                    <MapPin className="w-3 h-3 text-accent-gold" />
                    <span>{loc.label}</span>
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
