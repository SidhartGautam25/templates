"use client";

import React from "react";
import { Edit, Trash2, MapPin, Tag, Plus, Info } from "lucide-react";

interface ProjectData {
  id: string;
  name: string;
  location: string;
  typology: string;
  price: string;
  image: string;
  possession?: string | null;
  tag1?: string | null;
  tag2?: string | null;
  highlights: string[];
  rera: string;
  category: "apartments" | "plots";
  isNewLaunch?: boolean;
  sortOrder?: number;
}

interface ProjectsListProps {
  projects: ProjectData[];
  onEdit: (project: ProjectData) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function ProjectsList({ projects, onEdit, onDelete, onAdd }: ProjectsListProps) {
  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold font-serif text-primary">
          Project Master List ({projects.length})
        </h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-accent-gold hover:bg-accent-gold-dark text-primary font-bold px-5 py-2.5 rounded-xl text-xs tracking-wider transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          ADD NEW PROJECT
        </button>
      </div>

      {/* Grid of projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow group"
            >
              {/* Image Thumbnail */}
              <div className="relative h-44 w-full bg-primary/10 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* New Launch badge */}
                {project.isNewLaunch && (
                  <span className="absolute top-3 left-3 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm text-primary bg-accent-gold border-accent-gold-dark">
                    ★ NEW LAUNCH
                  </span>
                )}
                {/* Category badge */}
                <span className={`absolute top-3 right-3 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm text-white ${
                  project.category === "plots"
                    ? "bg-amber-600 border-amber-500"
                    : "bg-blue-800 border-blue-700"
                }`}>
                  {project.category}
                </span>
              </div>

              {/* Contents */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center space-x-1.5 text-text-muted">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider truncate">
                      {project.location}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-primary font-serif line-clamp-1">
                    {project.name}
                  </h4>
                  
                  {/* Prices and Typology */}
                  <div className="grid grid-cols-2 gap-2 pt-1.5">
                    <div className="bg-bg-tan/30 p-2 rounded-lg border border-black/[0.03]">
                      <span className="block text-[8px] uppercase tracking-wider text-text-muted font-bold">Price</span>
                      <span className="text-xs font-extrabold text-primary truncate block mt-0.5">{project.price}</span>
                    </div>
                    <div className="bg-bg-tan/30 p-2 rounded-lg border border-black/[0.03]">
                      <span className="block text-[8px] uppercase tracking-wider text-text-muted font-bold">Typology</span>
                      <span className="text-xs font-extrabold text-primary truncate block mt-0.5">{project.typology}</span>
                    </div>
                  </div>

                  {/* RERA, Possession, and Display Order */}
                  <div className="text-[10px] text-text-muted font-medium space-y-1 pt-1">
                    <div className="flex items-center justify-between">
                      <span>RERA ID:</span>
                      <span className="font-bold text-primary">{project.rera}</span>
                    </div>
                    {project.possession && (
                      <div className="flex items-center justify-between">
                        <span>Possession:</span>
                        <span className="font-bold text-primary">{project.possession}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t border-black/[0.03] pt-1 mt-1">
                      <span>Display Order (Priority):</span>
                      <span className="font-bold text-accent-gold-dark">{project.sortOrder ?? 0}</span>
                    </div>
                  </div>
                </div>

                {/* Management Action Buttons */}
                <div className="flex items-center gap-2 border-t border-black/[0.05] pt-4 mt-2">
                  <button
                    onClick={() => onEdit(project)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-bg-tan/60 hover:bg-bg-tan/100 text-primary font-bold py-2 rounded-xl text-xs transition-colors border border-black/[0.04] cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(project.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 rounded-xl text-xs transition-colors border border-red-200/40 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white border border-black/[0.06] rounded-2xl p-12 text-center text-text-muted italic flex flex-col items-center justify-center space-y-2">
            <Info className="w-8 h-8 text-text-muted" />
            <p>No projects present in the database. Use the "Add New Project" button to create one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
