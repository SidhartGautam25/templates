"use client";

import React, { useState, useMemo } from "react";
import { LeadData } from "../hooks/useLeads";
import { Search, Filter, Download, Calendar } from "lucide-react";
import { SITE } from "@/constants";

interface LeadsTableProps {
  leads: LeadData[];
}

export default function LeadsTable({ leads }: LeadsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState("all");

  // Get unique room names for filter dropdown
  const projectsList = useMemo(() => {
    const names = new Set(leads.map((l) => l.roomTypeName));
    return Array.from(names).sort();
  }, [leads]);

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.phone.includes(query) ||
        (lead.message && lead.message.toLowerCase().includes(query));

      const matchesProject =
        selectedProject === "all" || lead.roomTypeName === selectedProject;

      return matchesSearch && matchesProject;
    });
  }, [leads, searchQuery, selectedProject]);

  // CSV Export Utility
  const downloadCSV = () => {
    const headers = ["Date", "Room Name", "Client Name", "Email", "Phone", "Message"];
    const rows = filteredLeads.map((lead) => [
      new Date(lead.createdAt).toLocaleString(),
      lead.roomTypeName,
      lead.name,
      lead.email,
      lead.phone,
      lead.message || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${SITE.admin.leadsExportPrefix}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Table Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-black/[0.06] rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-2xl">
          {/* Search box */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-tan/40 border border-black/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
            />
          </div>

          {/* Room filter */}
          <div className="relative min-w-[200px]">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted pointer-events-none">
              <Filter className="w-3.5 h-3.5" />
            </span>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full bg-bg-tan/40 border border-black/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold appearance-none cursor-pointer"
            >
              <option value="all">All Rooms</option>
              {projectsList.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Download CSV button */}
        <button
          onClick={downloadCSV}
          disabled={filteredLeads.length === 0}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white disabled:opacity-50 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export CSV ({filteredLeads.length})
        </button>
      </div>

      {/* Datatable */}
      <div className="bg-white border border-black/[0.06] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-tan/30 border-b border-black/[0.05] text-[10px] uppercase tracking-wider text-text-muted font-bold">
                <th className="px-6 py-4">Submission Date</th>
                <th className="px-6 py-4">Client Contact</th>
                <th className="px-6 py-4">Room Requested</th>
                <th className="px-6 py-4">Message Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] text-xs text-text-main">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-bg-tan/10 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-text-muted" />
                        <span className="font-semibold text-text-muted">
                          {new Date(lead.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-[10px] text-text-muted bg-black/[0.04] px-1.5 py-0.5 rounded">
                          {new Date(lead.createdAt).toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-extrabold text-sm text-primary block">
                          {lead.name}
                        </span>
                        <span className="text-text-muted block mt-0.5">{lead.email}</span>
                        <a
                          href={`tel:+91${lead.phone}`}
                          className="text-accent-gold-dark hover:underline font-bold mt-1 block"
                        >
                          +91 {lead.phone}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10 text-primary font-bold">
                        {lead.roomTypeName}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      {lead.message ? (
                        <p className="text-text-main/80 line-clamp-3 leading-relaxed">
                          {lead.message}
                        </p>
                      ) : (
                        <span className="text-text-muted italic">No message provided</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-text-muted italic">
                    No leads found matching current query filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
