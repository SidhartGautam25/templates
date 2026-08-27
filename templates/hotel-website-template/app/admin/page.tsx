"use client";

import React, { useMemo, useState } from "react";
import AdminShell from "@/lib/admin/AdminShell";
import { getAdminTabs } from "./registry";
import { useGetLeads } from "./hooks/useLeads";
import { useGetRoomTypes } from "./hooks/useRoomTypes";
import DashboardStats from "./components/DashboardStats";

export default function AdminDashboard() {
  const tabs = useMemo(() => getAdminTabs(), []);
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? "leads");

  const { data: leads = [], isLoading: isLoadingLeads } = useGetLeads();
  const { data: roomTypes = [], isLoading: isLoadingRoomTypes } = useGetRoomTypes();

  const apartmentsCount = roomTypes.filter(
    (room: { name: string }) =>
      room.name.toLowerCase().includes("deluxe") ||
      room.name.toLowerCase().includes("suite") ||
      room.name.toLowerCase().includes("family")
  ).length;
  const plotsCount = roomTypes.length - apartmentsCount;

  const loading =
    (activeTabId === "leads" && isLoadingLeads) ||
    (activeTabId === "room-types" && isLoadingRoomTypes);

  return (
    <AdminShell
      tabs={tabs}
      activeTabId={activeTabId}
      onTabChange={setActiveTabId}
      title="Management Dashboard"
      subtitle="Track customer enquiries and configure luxury room types."
      loading={loading}
      statsSlot={
        <DashboardStats
          totalLeads={leads.length}
          totalProjects={roomTypes.length}
          apartmentsCount={apartmentsCount}
          plotsCount={plotsCount}
        />
      }
    />
  );
}
