"use client";

import React from "react";
import { Users, FileText, Home, Layers } from "lucide-react";

interface DashboardStatsProps {
  totalLeads: number;
  totalProjects: number;
  apartmentsCount: number;
  plotsCount: number;
}

export default function DashboardStats({
  totalLeads,
  totalProjects,
  apartmentsCount,
  plotsCount,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Total Leads",
      value: totalLeads,
      icon: Users,
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    {
      label: "Total Projects",
      value: totalProjects,
      icon: Layers,
      color: "bg-accent-gold/15 text-accent-gold-dark border-accent-gold/30",
    },
    {
      label: "Apartment Developments",
      value: apartmentsCount,
      icon: Home,
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    {
      label: "Plotted Estates",
      value: plotsCount,
      icon: FileText,
      color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white border border-black/[0.06] rounded-2xl p-6 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow"
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${stat.color}`}>
            <stat.icon className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs font-bold text-text-muted uppercase tracking-wider">
              {stat.label}
            </span>
            <span className="text-2xl font-extrabold font-sans text-primary mt-1 block">
              {stat.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
