"use client";

import React from "react";
import { Edit, Trash2, BedDouble, Plus, Info, Compass, Maximize2, Bath } from "lucide-react";

interface RoomTypeData {
  id: string;
  name: string;
  startingPrice: number;
  size: string;
  view: string;
  bedType: string;
  bathrooms: string;
  image: string;
  amenities: {
    popular: string[];
    features: string[];
    basic: string[];
    media: string[];
    bathroom: string[];
  };
  ratePlans: {
    option: string;
    details: string[];
    price: number;
    discountedPrice: number;
    taxesAndFees: number;
  }[];
  sortOrder?: number;
}

interface RoomTypesListProps {
  roomTypes: RoomTypeData[];
  onEdit: (roomType: RoomTypeData) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function RoomTypesList({ roomTypes, onEdit, onDelete, onAdd }: RoomTypesListProps) {
  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold font-serif text-primary">
          Room Types Master List ({roomTypes.length})
        </h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-accent-gold hover:bg-accent-gold-dark text-primary font-bold px-5 py-2.5 rounded-xl text-xs tracking-wider transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          ADD NEW ROOM TYPE
        </button>
      </div>

      {/* Grid of rooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roomTypes.length > 0 ? (
          roomTypes.map((room) => (
            <div
              key={room.id}
              className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow group"
            >
              {/* Image Thumbnail */}
              <div className="relative h-44 w-full bg-primary/10 overflow-hidden">
                <img
                  src={room.image && room.image.startsWith("[") ? (() => {
                    try {
                      const parsed = JSON.parse(room.image);
                      return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : room.image;
                    } catch (e) {
                      return room.image;
                    }
                  })() : room.image}
                  alt={room.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Bed Type Badge */}
                <span className="absolute top-3 left-3 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm text-primary bg-accent-gold border-accent-gold-dark flex items-center gap-1">
                  <BedDouble className="w-3.5 h-3.5" />
                  {room.bedType}
                </span>
                {/* View badge */}
                {room.view && (
                  <span className="absolute top-3 right-3 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm text-white bg-amber-600 border-amber-500 flex items-center gap-1">
                    <Compass className="w-3 h-3" />
                    {room.view}
                  </span>
                )}
              </div>

              {/* Contents */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <h4 className="text-base font-bold text-primary font-serif line-clamp-1">
                    {room.name}
                  </h4>
                  
                  {/* Specs grid */}
                  <div className="grid grid-cols-3 gap-2 pt-1.5">
                    <div className="bg-bg-tan/30 p-2 rounded-lg border border-black/[0.03]">
                      <span className="block text-[8px] uppercase tracking-wider text-text-muted font-bold flex items-center gap-1"><Maximize2 className="w-2 h-2" /> Size</span>
                      <span className="text-[10px] font-extrabold text-primary truncate block mt-0.5">{room.size}</span>
                    </div>
                    <div className="bg-bg-tan/30 p-2 rounded-lg border border-black/[0.03]">
                      <span className="block text-[8px] uppercase tracking-wider text-text-muted font-bold flex items-center gap-1"><Bath className="w-2 h-2" /> Bath</span>
                      <span className="text-[10px] font-extrabold text-primary truncate block mt-0.5">{room.bathrooms}</span>
                    </div>
                    <div className="bg-bg-tan/30 p-2 rounded-lg border border-black/[0.03]">
                      <span className="block text-[8px] uppercase tracking-wider text-text-muted font-bold">Starting Price</span>
                      <span className="text-[10px] font-extrabold text-primary truncate block mt-0.5">₹{room.startingPrice.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {/* Summary & Display Order */}
                  <div className="text-[10px] text-text-muted font-medium space-y-1 pt-1">
                    <div className="flex items-center justify-between border-t border-black/[0.03] pt-1 mt-1">
                      <span>Display Order (Priority):</span>
                      <span className="font-bold text-accent-gold-dark">{room.sortOrder ?? 0}</span>
                    </div>
                  </div>
                </div>

                {/* Management Action Buttons */}
                <div className="flex items-center gap-2 border-t border-black/[0.05] pt-4 mt-2">
                  <button
                    onClick={() => onEdit(room)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-bg-tan/60 hover:bg-bg-tan/100 text-primary font-bold py-2 rounded-xl text-xs transition-colors border border-black/[0.04] cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(room.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 rounded-xl text-xs transition-colors border border-red-200/40 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white border border-black/[0.06] rounded-2xl p-12 text-center text-text-muted italic flex flex-col items-center justify-center space-y-2">
            <Info className="w-8 h-8 text-text-muted" />
            <p>No room types present in the database. Use the "Add New Room Type" button to create one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
