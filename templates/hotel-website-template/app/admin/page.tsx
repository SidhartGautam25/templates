"use client";

import React, { useState } from "react";
import { SITE } from "@/constants";
import { useGetProjects, useCreateProject, useUpdateProject, useDeleteProject } from "./hooks/useProjects";
import { useGetLeads } from "./hooks/useLeads";
import DashboardStats from "./components/DashboardStats";
import LeadsTable from "./components/LeadsTable";
import ProjectsList from "./components/ProjectsList";
import ProjectFormModal from "./components/ProjectFormModal";
import PromoBannerForm from "./components/PromoBannerForm";
import LaunchLogoForm from "./components/LaunchLogoForm";
import FacilitiesList from "./components/FacilitiesList";
import ReviewsList from "./components/ReviewsList";
import { Layers, Users, LogOut, Sliders, Info, XCircle, Award, Sparkles, MessageSquare } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminDashboard() {
  // Tab State
  const [activeTab, setActiveTab] = useState<"leads" | "projects" | "banner" | "logo" | "facilities" | "reviews">("leads");

  // Project Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [notification, setNotification] = useState<{ title: string; messages: string[]; type: "info" | "success" | "error" } | null>(null);
  const [projectFormError, setProjectFormError] = useState<string | null>(null);

  // Queries
  const { data: projects = [], isLoading: isLoadingProjects } = useGetProjects();
  const { data: leads = [], isLoading: isLoadingLeads } = useGetLeads();

  // Mutations
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.href = "/admin/login";
  };

  // CRUD Actions
  const handleOpenAddModal = () => {
    setEditingProject(null);
    setProjectFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: any) => {
    setEditingProject(project);
    setProjectFormError(null);
    setIsModalOpen(true);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm("Are you sure you want to delete this project? This will also remove the image file.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSubmit = (data: any) => {
    setProjectFormError(null);
    if (editingProject) {
      updateMutation.mutate(data, {
        onSuccess: (result: any) => {
          setIsModalOpen(false);
          if (result.logs && result.logs.length > 0) {
            setNotification({
              title: "FTP Storage Notice",
              messages: result.logs,
              type: "info",
            });
          }
        },
        onError: (err: any) => {
          setProjectFormError(err.message || "An unexpected error occurred during project update.");
        },
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: (result: any) => {
          setIsModalOpen(false);
          if (result.logs && result.logs.length > 0) {
            setNotification({
              title: "FTP Storage Notice",
              messages: result.logs,
              type: "info",
            });
          }
        },
        onError: (err: any) => {
          setProjectFormError(err.message || "An unexpected error occurred during project creation.");
        },
      });
    }
  };

  // Derived statistics metrics
  const apartmentsCount = projects.filter((p: any) =>
    p.name.toLowerCase().includes("deluxe") ||
    p.name.toLowerCase().includes("suite") ||
    p.name.toLowerCase().includes("family")
  ).length;
  const plotsCount = projects.length - apartmentsCount;

  // Render Dashboard
  return (
    <div className="min-h-screen bg-bg-tan/20 flex flex-col md:flex-row">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-primary text-white flex flex-col justify-between p-6 md:fixed md:inset-y-0 md:left-0 z-30">
        <div className="space-y-8">
          {/* Logo Title */}
          <div>
            <span className="text-[10px] font-bold tracking-widest text-accent-gold uppercase block mb-0.5">
              Admin Workspace
            </span>
            <h2 className="text-lg font-bold font-serif tracking-tight border-b border-white/10 pb-4">
              {SITE.admin.displayName}
            </h2>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2.5">
            <button
              onClick={() => setActiveTab("leads")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                activeTab === "leads"
                  ? "bg-accent-gold text-primary shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customer Leads</span>
            </button>

            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                activeTab === "projects"
                  ? "bg-accent-gold text-primary shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Room Types</span>
            </button>

            <button
              onClick={() => setActiveTab("banner")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                activeTab === "banner"
                  ? "bg-accent-gold text-primary shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Promo Settings</span>
            </button>

            <button
              onClick={() => setActiveTab("logo")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                activeTab === "logo"
                  ? "bg-accent-gold text-primary shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Launch Logo</span>
            </button>

            <button
              onClick={() => setActiveTab("facilities")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                activeTab === "facilities"
                  ? "bg-accent-gold text-primary shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Resort Facilities</span>
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                activeTab === "reviews"
                  ? "bg-accent-gold text-primary shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Guest Reviews</span>
            </button>
          </nav>
        </div>

        {/* Log Out button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 text-white/60 hover:text-red-300 transition-colors pt-6 border-t border-white/10 text-xs font-bold tracking-wide cursor-pointer mt-8 md:mt-0"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </aside>

      {/* Main content body */}
      <main className="flex-1 md:ml-64 p-6 md:p-10 space-y-8 max-w-7xl">
        {/* Top Header stats area */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-serif text-primary tracking-tight">
              Management Dashboard
            </h1>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Track customer enquiries and configure luxury room types.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <DashboardStats
          totalLeads={leads.length}
          totalProjects={projects.length}
          apartmentsCount={apartmentsCount}
          plotsCount={plotsCount}
        />

        {/* Main Panel View */}
        <div className="pt-2">
          {isLoadingProjects || isLoadingLeads ? (
            <div className="bg-white border border-black/[0.06] rounded-2xl p-12 text-center text-text-muted flex flex-col items-center justify-center space-y-3">
              <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-xs font-bold tracking-wider uppercase text-text-muted">
                Synchronizing Database state...
              </span>
            </div>
          ) : activeTab === "leads" ? (
            <LeadsTable leads={leads} />
          ) : activeTab === "projects" ? (
            <ProjectsList
              projects={projects}
              onAdd={handleOpenAddModal}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteProject}
            />
          ) : activeTab === "banner" ? (
            <PromoBannerForm />
          ) : activeTab === "facilities" ? (
            <FacilitiesList />
          ) : activeTab === "reviews" ? (
            <ReviewsList />
          ) : (
            <LaunchLogoForm />
          )}
        </div>
      </main>

      {/* Project Form Modal */}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setProjectFormError(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingProject}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        error={projectFormError}
      />

      {/* Custom Notification Modal */}
      {notification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-black/[0.05]">
            <div className="flex items-center space-x-3">
              {notification.type === "error" ? (
                <div className="p-2 bg-red-50 text-red-600 rounded-full">
                  <XCircle className="w-6 h-6" />
                </div>
              ) : (
                <div className="p-2 bg-accent-gold/10 text-accent-gold-dark rounded-full">
                  <Info className="w-6 h-6" />
                </div>
              )}
              <h4 className="text-sm font-bold font-serif text-primary">
                {notification.title}
              </h4>
            </div>
            <div className="space-y-2 max-h-[40vh] overflow-y-auto text-xs text-text-muted leading-relaxed">
              {notification.messages.map((msg, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <span className="text-accent-gold font-bold">•</span>
                  <span>{msg}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setNotification(null)}
                className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
