"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";
import {
  useGetProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "../hooks/useProjects";
import ProjectsList from "../components/ProjectsList";
import ProjectFormModal from "../components/ProjectFormModal";

export default function ProjectsPanel() {
  const { data: projects = [], isLoading } = useGetProjects();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    title: string;
    messages: string[];
  } | null>(null);

  if (isLoading) {
    return (
      <div className="bg-white border border-black/[0.06] rounded-2xl p-12 text-center text-text-muted">
        Loading projects...
      </div>
    );
  }

  const handleFormSubmit = (data: any) => {
    setFormError(null);
    const mutation = editingProject ? updateMutation : createMutation;
    mutation.mutate(data, {
      onSuccess: (result: any) => {
        setIsModalOpen(false);
        if (result?.logs?.length) {
          setNotification({ title: "FTP Storage Notice", messages: result.logs });
        }
      },
      onError: (err: any) => setFormError(err.message || "Failed to save project."),
    });
  };

  return (
    <>
      <ProjectsList
        projects={projects}
        onAdd={() => {
          setEditingProject(null);
          setFormError(null);
          setIsModalOpen(true);
        }}
        onEdit={(project) => {
          setEditingProject(project);
          setFormError(null);
          setIsModalOpen(true);
        }}
        onDelete={(id) => {
          if (confirm("Delete this project?")) deleteMutation.mutate(id);
        }}
      />

      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormError(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingProject}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        error={formError}
      />

      {notification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h4 className="text-sm font-bold font-serif text-primary">{notification.title}</h4>
            <div className="space-y-2 text-xs text-text-muted">
              {notification.messages.map((msg, i) => (
                <p key={i}>{msg}</p>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
