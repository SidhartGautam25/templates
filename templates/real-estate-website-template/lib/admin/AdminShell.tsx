"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { SITE } from "@/constants";
import type { AdminTabDefinition } from "./types";

interface AdminShellProps {
  tabs: AdminTabDefinition[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  title?: string;
  subtitle?: string;
  statsSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  loading?: boolean;
}

export default function AdminShell({
  tabs,
  activeTabId,
  onTabChange,
  title = "Management Dashboard",
  subtitle,
  statsSlot,
  footerSlot,
  loading = false,
}: AdminShellProps) {
  const active = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-bg-tan/20 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-primary text-white flex flex-col justify-between p-6 md:fixed md:inset-y-0 md:left-0 z-30">
        <div className="space-y-8">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-accent-gold uppercase block mb-0.5">
              Admin Workspace
            </span>
            <h2 className="text-lg font-bold font-serif tracking-tight border-b border-white/10 pb-4">
              {SITE.admin.displayName}
            </h2>
          </div>

          <nav className="space-y-2.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  activeTabId === tab.id
                    ? "bg-accent-gold text-primary shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center space-x-3 text-white/60 hover:text-red-300 transition-colors pt-6 border-t border-white/10 text-xs font-bold tracking-wide cursor-pointer mt-8 md:mt-0"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </aside>

      <main className="flex-1 md:ml-64 p-6 md:p-10 space-y-8 max-w-7xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-serif text-primary tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-text-muted mt-1 leading-relaxed">{subtitle}</p>
          )}
        </div>

        {statsSlot}

        <div className="pt-2">
          {loading ? (
            <div className="bg-white border border-black/[0.06] rounded-2xl p-12 text-center text-text-muted flex flex-col items-center justify-center space-y-3">
              <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx={12}
                  cy={12}
                  r={10}
                  stroke="currentColor"
                  strokeWidth={4}
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-xs font-bold tracking-wider uppercase text-text-muted">
                Synchronizing database state...
              </span>
            </div>
          ) : active ? (
            <active.Panel />
          ) : null}
        </div>

        {footerSlot}
      </main>
    </div>
  );
}
