"use client";

import React from "react";
import { useGetLeads } from "../hooks/useLeads";
import LeadsTable from "../components/LeadsTable";

export default function LeadsPanel() {
  const { data: leads = [] } = useGetLeads();
  return <LeadsTable leads={leads} />;
}
