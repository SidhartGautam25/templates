"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";
import {
  useGetRoomTypes,
  useCreateRoomType,
  useUpdateRoomType,
  useDeleteRoomType,
  type RoomTypeDataInput,
} from "../hooks/useRoomTypes";
import RoomTypesList from "../components/RoomTypesList";
import RoomTypeFormModal from "../components/RoomTypeFormModal";

export default function RoomTypesPanel() {
  const { data: roomTypes = [], isLoading } = useGetRoomTypes();
  const createMutation = useCreateRoomType();
  const updateMutation = useUpdateRoomType();
  const deleteMutation = useDeleteRoomType();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState<RoomTypeDataInput | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    title: string;
    messages: string[];
  } | null>(null);

  if (isLoading) {
    return (
      <div className="bg-white border border-black/[0.06] rounded-2xl p-12 text-center text-text-muted">
        Loading room types...
      </div>
    );
  }

  const handleFormSubmit = (data: RoomTypeDataInput) => {
    setFormError(null);
    const mutation = editingRoomType ? updateMutation : createMutation;
    mutation.mutate(data, {
      onSuccess: (result: { logs?: string[] }) => {
        setIsModalOpen(false);
        if (result?.logs?.length) {
          setNotification({ title: "FTP Storage Notice", messages: result.logs });
        }
      },
      onError: (err: Error) => setFormError(err.message || "Failed to save room type."),
    });
  };

  return (
    <>
      <RoomTypesList
        roomTypes={roomTypes}
        onAdd={() => {
          setEditingRoomType(null);
          setFormError(null);
          setIsModalOpen(true);
        }}
        onEdit={(roomType) => {
          setEditingRoomType(roomType);
          setFormError(null);
          setIsModalOpen(true);
        }}
        onDelete={(id) => {
          if (confirm("Delete this room type?")) deleteMutation.mutate(id);
        }}
      />

      <RoomTypeFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormError(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingRoomType}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        error={formError}
      />

      {notification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent-gold/10 text-accent-gold-dark rounded-full">
                <Info className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold font-serif text-primary">{notification.title}</h4>
            </div>
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
