"use client";

import React from "react";
import Link from "next/link";
import { RoomType } from "@/constants/default-room-types";
import { slugify } from "@/lib/utils/slugify";
import { ChevronRight, BedDouble, Bath, Maximize2, Compass } from "lucide-react";

interface ProjectCardProps {
  project: RoomType;
  onOpenEnquiry: (projectName: string) => void;
  newLaunchLogo?: string | null;
}

export default function ProjectCard({ project, onOpenEnquiry, newLaunchLogo }: ProjectCardProps) {
  const projectSlug = slugify(project.name);

  const displayImage = React.useMemo(() => {
    if (!project.image) return "/assets/placeholder-project.svg";
    if (project.image.startsWith("[")) {
      try {
        const parsed = JSON.parse(project.image);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0];
        }
      } catch (e) {
        console.error("Failed to parse project.image in ProjectCard:", e);
      }
    }
    return project.image;
  }, [project.image]);

  const highlights = project.amenities?.popular || [];

  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-black/[0.06] shadow-sm hover:shadow-xl transition-all duration-300 group">
      
      {/* Top Image Section */}
      <Link href={`/${projectSlug}`} className="relative h-60 w-full overflow-hidden block">
        <img
          src={displayImage}
          alt={project.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Floating View Badge */}
        {project.view && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded bg-black/75 text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
            <Compass className="w-3 h-3 text-accent-gold" />
            {project.view}
          </div>
        )}
      </Link>

      {/* Details Section */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-xl font-bold font-serif text-primary text-center mb-1 transition-colors">
            <Link href={`/${projectSlug}`} className="hover:text-accent-gold transition-colors block">
              {project.name}
            </Link>
          </h3>
          
          {/* Bed & Bath Summary */}
          <p className="text-xs text-text-muted text-center mb-3 pb-3 border-b border-black/[0.06] font-medium tracking-wide flex justify-center gap-4">
            <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5 text-primary" /> {project.bedType}</span>
            <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-primary" /> {project.bathrooms}</span>
          </p>

          {/* Badge Tags list */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <span className="px-2.5 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Maximize2 className="w-2.5 h-2.5" />
              {project.size}
            </span>
          </div>

          {/* Configuration & Price Row */}
          <div className="space-y-2.5 mb-6 text-sm">
            <div className="flex justify-between items-center">
              <span className="font-bold text-primary">Starting Price :</span>
              <span className="text-primary font-bold text-base">₹{project.startingPrice.toLocaleString("en-IN")} <span className="text-xs text-text-muted font-medium">/ night</span></span>
            </div>
          </div>

          {/* Amenities highlights */}
          <ul className="space-y-2 mb-6 flex flex-col items-start w-full">
            {highlights.slice(0, 4).map((highlight, index) => (
              <li key={index} className="flex items-start text-xs font-semibold text-primary/80 w-full">
                <ChevronRight className="w-3.5 h-3.5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span className="flex-1 text-left leading-normal">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onOpenEnquiry(project.name)}
          className="w-full py-3 rounded-xl bg-cta-primary hover:bg-cta-primary-hover text-white font-bold text-xs tracking-wider transition-all duration-300 shadow-md hover:scale-[1.02] cursor-pointer"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-black/[0.06] shadow-sm animate-pulse">
      {/* Top Image Section Skeleton */}
      <div className="relative h-60 w-full bg-slate-200" />

      {/* Details Section Skeleton */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          {/* Title */}
          <div className="h-6 bg-slate-200 rounded w-3/4 mx-auto mb-3" />
          
          {/* Location */}
          <div className="border-b border-black/[0.06] pb-4 mb-4">
            <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto" />
          </div>

          {/* Badge Tags list */}
          <div className="flex gap-2 justify-center mb-5">
            <div className="h-5 bg-slate-200 rounded w-24" />
          </div>

          {/* Configuration & Price Row */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-4 bg-slate-200 rounded w-1/3" />
            </div>
          </div>

          {/* Star Bullets */}
          <div className="space-y-2.5 mb-6 flex flex-col items-center">
            <div className="h-3 bg-slate-200 rounded w-2/3" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
          </div>
        </div>

        {/* CTA Button */}
        <div className="w-full h-11 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}

