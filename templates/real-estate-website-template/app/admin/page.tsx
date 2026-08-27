"use client";

import React, { useMemo, useState } from "react";
import AdminShell from "@/lib/admin/AdminShell";
import { getAdminTabs } from "./registry";
import { useGetLeads } from "./hooks/useLeads";

export default function AdminDashboard() {
  const tabs = useMemo(() => getAdminTabs(), []);
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? "leads");
  const { isLoading: isLoadingLeads } = useGetLeads();

  return (
    <AdminShell
      tabs={tabs}
      activeTabId={activeTabId}
      onTabChange={setActiveTabId}
      title="Management Dashboard"
      subtitle="Manage leads, site settings, and optional content modules."
      loading={activeTabId === "leads" && isLoadingLeads}
    />
  );
}
