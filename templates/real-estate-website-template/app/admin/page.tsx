"use client";

import React, { useMemo, useState } from "react";
import AdminShell from "@/lib/admin/AdminShell";
import { getAdminTabs } from "./registry";
import { useGetLeads } from "./hooks/useLeads";
import { useGetProjects } from "./hooks/useProjects";
import DashboardStats from "./components/DashboardStats";

export default function AdminDashboard() {
  const tabs = useMemo(() => getAdminTabs(), []);
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? "leads");

  const { data: leads = [], isLoading: isLoadingLeads } = useGetLeads();
  const { data: projects = [], isLoading: isLoadingProjects } = useGetProjects();

  const apartmentsCount = projects.filter((p: { category: string }) =>
    p.category?.toLowerCase().includes("apartment")
  ).length;
  const plotsCount = projects.length - apartmentsCount;

  const loading =
    (activeTabId === "leads" && isLoadingLeads) ||
    (activeTabId === "projects" && isLoadingProjects);

  return (
    <AdminShell
      tabs={tabs}
      activeTabId={activeTabId}
      onTabChange={setActiveTabId}
      title="Management Dashboard"
      subtitle="Track enquiries and manage property listings."
      loading={loading}
      statsSlot={
        <DashboardStats
          totalLeads={leads.length}
          totalProjects={projects.length}
          apartmentsCount={apartmentsCount}
          plotsCount={plotsCount}
        />
      }
    />
  );
}
