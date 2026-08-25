"use client";

import React from "react";
import Link from "next/link";
import { Project } from "../data/projects";
import { slugify } from "@/lib/utils/slugify";
import { ChevronRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onOpenEnquiry: (projectName: string) => void;
  newLaunchLogo?: string | null;
}

export default function ProjectCard({ project, onOpenEnquiry, newLaunchLogo }: ProjectCardProps) {
  const projectSlug = slugify(project.name);

  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-black/[0.06] shadow-sm hover:shadow-xl transition-all duration-300 group">
      
      {/* Top Image Section */}
      <Link href={`/${projectSlug}`} className="relative h-60 w-full overflow-hidden block">
        <img
          src={project.image}
          alt={project.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Floating Possession Badge (Safe from overlaps) */}
        {project.possession && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded bg-black/75 text-[10px] font-bold text-white uppercase tracking-wider">
            Possession: {project.possession}
          </div>
        )}

        {/* Circular Stamped Ink New Launch Badge or Custom Logo Badge */}
        {project.isNewLaunch && (
          <div className="absolute top-4 right-4 z-10 pointer-events-none select-none rotate-[-12deg] drop-shadow-md">
            {newLaunchLogo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={newLaunchLogo}
                alt="New Launch Logo"
                className="w-20 h-20 object-contain"
              />
            ) : (
              <div className="w-20 h-20 rounded-full border-4 border-double border-red-600 flex flex-col items-center justify-center bg-white/90 backdrop-blur-[1px] text-red-600 p-1 shadow-inner relative">
                {/* Inner dashed ring */}
                <div className="absolute inset-0.5 rounded-full border border-dashed border-red-500/40"></div>
                
                {/* Text elements inside stamp */}
                <span className="text-[7px] font-bold tracking-widest opacity-85 uppercase leading-none font-sans">GODREJ</span>
                <span className="text-[10px] font-black tracking-normal uppercase my-0.5 py-0.5 px-1 border-y-2 border-red-600 leading-none font-serif">
                  NEW LAUNCH
                </span>
                <span className="text-[6px] font-bold tracking-widest opacity-85 uppercase leading-none font-sans">PROPERTIES</span>
              </div>
            )}
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
          
          {/* Location */}
          <p className="text-xs text-text-muted text-center mb-3 pb-3 border-b border-black/[0.06] font-medium tracking-wide">
            {project.location}
          </p>

          {/* Badge Tags list (Flex layout avoids overlap) */}
          {(project.tag1 || project.tag2) && (
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {project.tag1 && (
                <span className="px-2.5 py-1 rounded bg-accent-gold/10 border border-accent-gold/30 text-accent-gold-dark text-[9px] font-extrabold uppercase tracking-wider">
                  {project.tag1}
                </span>
              )}
              {project.tag2 && (
                <span className="px-2.5 py-1 rounded bg-primary/5 border border-primary/10 text-primary/80 text-[9px] font-extrabold uppercase tracking-wider">
                  {project.tag2}
                </span>
              )}
            </div>
          )}

          {/* Configuration & Price Row */}
          <div className="space-y-2.5 mb-6 text-sm">
            <div className="flex justify-between items-center">
              <span className="font-bold text-primary">Typology :</span>
              <span className="text-text-muted font-medium">{project.typology}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-primary">Price :</span>
              <span className="text-accent-gold-dark font-bold">{project.price}</span>
            </div>
          </div>

          {/* Arrow Bullets */}
          <ul className="space-y-2 mb-6 flex flex-col items-start w-full">
            {project.highlights.slice(0, 4).map((highlight, index) => (
              <li key={index} className="flex items-start text-xs font-semibold text-primary/80 w-full">
                <ChevronRight className="w-3.5 h-3.5 text-accent-gold-dark mr-2 mt-0.5 flex-shrink-0" />
                <span className="flex-1 text-left leading-normal">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onOpenEnquiry(project.name)}
          className="w-full py-3 rounded-xl gold-gradient hover:gold-gradient-hover text-primary font-bold text-xs tracking-wider transition-all duration-300 shadow-md hover:scale-[1.02] cursor-pointer"
        >
          Interested
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
            <div className="h-5 bg-slate-200 rounded w-20" />
          </div>

          {/* Configuration & Price Row */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-4 bg-slate-200 rounded w-1/3" />
            </div>
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

