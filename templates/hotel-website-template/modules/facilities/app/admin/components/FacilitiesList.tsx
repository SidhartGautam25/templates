"use client";

import React, { useState } from "react";
import {
  Bell,
  Wifi,
  Wind,
  RefreshCw,
  Car,
  Utensils,
  Zap,
  Sparkles,
  Tv,
  Bath,
  Shield,
  Key,
  Plus,
  Edit2,
  Trash2,
  HelpCircle,
} from "lucide-react";
import {
  useGetFacilities,
  useCreateFacility,
  useUpdateFacility,
  useDeleteFacility,
  FacilityDataInput,
} from "../hooks/useFacilities";
import FacilityFormModal from "./FacilityFormModal";

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  bell: Bell,
  wifi: Wifi,
  wind: Wind,
  "refresh-cw": RefreshCw,
  car: Car,
  utensils: Utensils,
  zap: Zap,
  sparkles: Sparkles,
  tv: Tv,
  bath: Bath,
  shield: Shield,
  key: Key,
};

export default function FacilitiesList() {
  const { data: facilities = [], isLoading, error: fetchError } = useGetFacilities();
  const createMutation = useCreateFacility();
  const updateMutation = useUpdateFacility();
  const deleteMutation = useDeleteFacility();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [submitError, setSubmitError] = useState("");

  const handleOpenAdd = () => {
    setSelectedFacility(null);
    setSubmitError("");
    setModalOpen(true);
  };

  const handleOpenEdit = (facility: any) => {
    setSelectedFacility(facility);
    setSubmitError("");
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this facility?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err: any) {
        alert(err.message || "Failed to delete facility");
      }
    }
  };

  const handleFormSubmit = async (data: FacilityDataInput) => {
    setSubmitError("");
    try {
      if (data.id) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
      setModalOpen(false);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to save facility details.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-text-muted">
        Loading resort facilities...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* List Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-serif text-primary">Resort Facilities</h2>
          <p className="text-xs text-text-muted mt-1">
            Manage the core amenities and main facilities displayed to visitors on the home page.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-md hover:scale-[1.02] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Facility
        </button>
      </div>

      {fetchError && (
        <div className="p-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
          {(fetchError as any).message || "Failed to load facilities."}
        </div>
      )}

      {/* Facilities Grid */}
      {facilities.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-black/[0.08] rounded-2xl bg-bg-tan/10 text-xs text-text-muted">
          No facilities added yet. Click "Add Facility" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac: any) => {
            const Icon = ICON_MAP[fac.icon] || HelpCircle;
            return (
              <div
                key={fac.id}
                className="bg-white rounded-2xl border border-black/[0.06] p-5 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                {/* Decoration Accent */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-accent-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                <div>
                  {/* Icon & Title */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-bg-tan/40 flex items-center justify-center text-accent-gold-dark border border-black/[0.04]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-bold text-text-muted bg-bg-tan/30 px-2 py-0.5 rounded-full uppercase">
                      Order: {fac.sortOrder}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-primary mb-1.5">{fac.title}</h4>
                  <p className="text-xs text-text-muted leading-relaxed font-sans line-clamp-3">
                    {fac.description}
                  </p>
                </div>

                {/* Actions Section */}
                <div className="flex items-center justify-end space-x-2 pt-4 mt-4 border-t border-black/[0.04]">
                  <button
                    onClick={() => handleOpenEdit(fac)}
                    className="p-2 rounded-lg hover:bg-bg-tan/40 text-text-muted hover:text-primary transition-colors cursor-pointer"
                    title="Edit Facility"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(fac.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete Facility"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      <FacilityFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedFacility}
        error={submitError}
      />
    </div>
  );
}
