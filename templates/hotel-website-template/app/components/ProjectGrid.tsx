"use client";

import React, { useState, useEffect } from "react";
import ProjectCard, { ProjectCardSkeleton } from "./ProjectCard";
import { defaultRoomTypes, RoomType } from "@/constants/default-room-types";
import { SITE } from "@/constants";

interface ProjectGridProps {
  onOpenEnquiry: (projectName: string) => void;
}

export default function ProjectGrid({ onOpenEnquiry }: ProjectGridProps) {
  const [activeTab, setActiveTab] = useState<"all" | "apartments" | "plots">("all");
  const [projects, setProjects] = useState<RoomType[]>([]);
  const [newLaunchLogo, setNewLaunchLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/room-types");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: RoomType[] = json.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            startingPrice: p.startingPrice,
            size: p.size,
            view: p.view,
            bedType: p.bedType,
            bathrooms: p.bathrooms,
            image: p.image,
            amenities: p.amenities,
            ratePlans: p.ratePlans,
            sortOrder: p.sortOrder,
          }));
          setProjects(mapped);
        } else {
          setProjects(defaultRoomTypes);
        }
      } catch (err) {
        console.warn("Failed to load room types from API, falling back to static data:", err);
        setProjects(defaultRoomTypes);
      } finally {
        setLoading(false);
      }
    }

    async function loadLogo() {
      try {
        const res = await fetch("/api/promo-banner");
        const json = await res.json();
        if (json.success && json.data) {
          setNewLaunchLogo(json.data.newLaunchLogoUrl || null);
        }
      } catch (err) {
        console.warn("Failed to load launch logo settings:", err);
      }
    }

    loadProjects();
    loadLogo();
  }, []);

  const filteredProjects = projects.filter((project) => {
    if (activeTab === "all") return true;
    const isDeluxeOrSuite =
      project.name.toLowerCase().includes("deluxe") ||
      project.name.toLowerCase().includes("suite") ||
      project.name.toLowerCase().includes("family");
    if (activeTab === "apartments") return isDeluxeOrSuite;
    return !isDeluxeOrSuite;
  });

  return (
    <section id="projects-section" className="py-20 px-4 md:px-8 bg-bg-tan">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-primary uppercase mb-2 block">
            {SITE.projectGrid.eyebrow}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary tracking-tight">
            {SITE.projectGrid.title}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-primary/5 p-1.5 rounded-full border border-primary/5">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-2 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer ${
                activeTab === "all" ? "bg-primary text-white shadow-md" : "text-text-muted hover:text-primary"
              }`}
            >
              {SITE.projectGrid.tabs.all}
            </button>
            <button
              onClick={() => setActiveTab("apartments")}
              className={`px-6 py-2 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer ${
                activeTab === "apartments" ? "bg-primary text-white shadow-md" : "text-text-muted hover:text-primary"
              }`}
            >
              {SITE.projectGrid.tabs.apartments}
            </button>
            <button
              onClick={() => setActiveTab("plots")}
              className={`px-6 py-2 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer ${
                activeTab === "plots" ? "bg-primary text-white shadow-md" : "text-text-muted hover:text-primary"
              }`}
            >
              {SITE.projectGrid.tabs.plots}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => <ProjectCardSkeleton key={idx} />)
            : filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project as any}
                  onOpenEnquiry={onOpenEnquiry}
                  newLaunchLogo={newLaunchLogo}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
