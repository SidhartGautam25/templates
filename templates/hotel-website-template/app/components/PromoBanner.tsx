"use client";

import React, { useState, useEffect } from "react";
import { SITE } from "@/constants";

interface PromoBannerData {
  imageUrl: string;
  sec1Title: string;
  sec1Sub: string;
  sec2Title: string;
  sec2Sub: string;
  sec3Title: string;
  sec3Sub: string;
  sec4Title: string;
  sec4Sub: string;
}

interface PromoBannerProps {
  onOpenEnquiry: (projectName?: string) => void;
}

export default function PromoBanner({ onOpenEnquiry }: PromoBannerProps) {
  const [data, setData] = useState<PromoBannerData>({
    imageUrl: SITE.promoBanner.imageUrl,
    sec1Title: SITE.promoBanner.sec1Title,
    sec1Sub: SITE.promoBanner.sec1Sub,
    sec2Title: SITE.promoBanner.sec2Title,
    sec2Sub: SITE.promoBanner.sec2Sub,
    sec3Title: SITE.promoBanner.sec3Title,
    sec3Sub: SITE.promoBanner.sec3Sub,
    sec4Title: SITE.promoBanner.sec4Title,
    sec4Sub: SITE.promoBanner.sec4Sub,
  });

  useEffect(() => {
    async function loadBanner() {
      try {
        const res = await fetch("/api/promo-banner");
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.warn("Failed to load promo banner data, using defaults:", err);
      }
    }
    loadBanner();
  }, []);

  return (
    <div className="w-full bg-white text-text-main">
      {data.imageUrl && (
        <div className="w-full relative overflow-hidden bg-bg-light">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.imageUrl} alt="Promotional Banner" className="w-full h-auto block" />
        </div>
      )}

      <div className="w-full bg-primary/90 py-4 px-4 border-y border-primary/10 shadow-inner">
        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-3 sm:flex sm:justify-center sm:items-center sm:gap-4">
          <button
            onClick={() => onOpenEnquiry("Book Site Visit")}
            className="w-full sm:w-auto justify-center gold-gradient hover:gold-gradient-hover text-primary rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all duration-300 shadow-md hover:scale-[1.02] cursor-pointer"
          >
            <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4M8 6C5.79 6 4 7.79 4 10v4c0 2.21 1.79 4 4 4h8" />
            </svg>
            <span className="whitespace-nowrap">Book Site Visit</span>
          </button>

          <button
            onClick={() => onOpenEnquiry("Get Details")}
            className="w-full sm:w-auto justify-center bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all duration-300 shadow-sm hover:scale-[1.02] cursor-pointer"
          >
            <svg className="w-4 h-4 text-accent-gold-light flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="whitespace-nowrap">Get Details</span>
          </button>
        </div>
      </div>

      <div className="w-full border-b border-primary/5 py-8 bg-bg-light/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-y-6 md:gap-y-0 text-center relative divide-y divide-primary/5 md:divide-y-0 md:divide-x md:divide-primary/10">
          <div className="flex flex-col justify-center px-4 pb-4 md:pb-0">
            <span className="text-xs md:text-sm font-extrabold text-primary tracking-tight leading-snug">{data.sec1Title}</span>
            <span className="text-[10px] md:text-xs font-semibold mt-1.5 uppercase tracking-wider">{data.sec1Sub}</span>
          </div>
          <div className="flex flex-col justify-center px-4 py-4 md:py-0">
            <span className="text-xs md:text-sm font-extrabold text-primary tracking-tight leading-snug">{data.sec2Title}</span>
            <span className="text-[10px] md:text-xs font-semibold mt-1.5 uppercase tracking-wider">{data.sec2Sub}</span>
          </div>
          <div className="flex flex-col justify-center px-4 py-4 md:py-0">
            <span className="text-xs md:text-sm font-extrabold text-primary tracking-tight leading-snug">{data.sec3Title}</span>
            <span className="text-[10px] md:text-xs font-semibold mt-1.5 uppercase tracking-wider">{data.sec3Sub}</span>
          </div>
          <div className="flex flex-col justify-center px-4 pt-4 md:pt-0">
            <span className="text-xs md:text-sm font-extrabold text-primary tracking-tight leading-snug">{data.sec4Title}</span>
            <span className="text-[10px] md:text-xs font-semibold mt-1.5 uppercase tracking-wider">{data.sec4Sub}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
