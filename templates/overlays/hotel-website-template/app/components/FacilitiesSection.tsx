"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Wifi,
  Wind,
  RefreshCw,
  Car,
  Utensils,
  Zap,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { defaultFacilities } from "@/constants/default-facilities";

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  bell: Bell,
  wifi: Wifi,
  wind: Wind,
  "refresh-cw": RefreshCw,
  car: Car,
  utensils: Utensils,
  zap: Zap,
  sparkles: Sparkles,
};

export default function FacilitiesSection() {
  const [facilities, setFacilities] = useState<any[]>(
    defaultFacilities.map((fac) => ({
      id: fac.id,
      title: fac.title,
      description: fac.description,
      icon: fac.icon,
      sortOrder: fac.sortOrder,
    }))
  );

  useEffect(() => {
    async function loadFacilities() {
      try {
        const res = await fetch("/api/facilities");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setFacilities(json.data);
        }
      } catch (err) {
        console.warn("Failed to load facilities for home page section, using fallback:", err);
      }
    }
    loadFacilities();
  }, []);

  if (facilities.length === 0) return null;

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-bg-tan border-t border-black/[0.03]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Heading */}
        <div className="text-center space-y-3">
          <span className="text-[10px] font-extrabold tracking-[0.25em] text-primary uppercase block font-sans">
            Luxury B&B Experience
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-serif text-primary tracking-tight">
            Main Facilities
          </h2>
          <div className="w-16 h-[2px] bg-primary mx-auto mt-4" />
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-6">
          {facilities.map((fac) => {
            const Icon = ICON_MAP[fac.icon] || HelpCircle;
            return (
              <div
                key={fac.id}
                className="bg-white rounded-3xl border border-black/[0.04] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center space-y-4 group hover:-translate-y-1"
              >
                {/* Icon Circle */}
                <div className="w-14 h-14 rounded-2xl bg-bg-tan/30 flex items-center justify-center text-primary border border-black/[0.02] group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-primary font-serif">
                    {fac.title}
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed font-sans font-light">
                    {fac.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
