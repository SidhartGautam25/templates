import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface RoomTypeDataInput {
  id?: string;
  name: string;
  startingPrice: number;
  size: string;
  view: string;
  bedType: string;
  bathrooms: string;
  image?: File | null;
  gallery?: File[];
  existingGallery?: string[];
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
  description?: string;
  sortOrder?: number;
}

export function useGetProjects() {
  return useQuery({
    queryKey: ["room-types"],
    queryFn: async () => {
      const res = await fetch("/api/room-types");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load room types");
      return json.data;
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RoomTypeDataInput) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("startingPrice", String(data.startingPrice));
      formData.append("size", data.size);
      formData.append("view", data.view);
      formData.append("bedType", data.bedType);
      formData.append("bathrooms", data.bathrooms);
      formData.append("amenities", JSON.stringify(data.amenities));
      formData.append("ratePlans", JSON.stringify(data.ratePlans));
      formData.append("sortOrder", String(data.sortOrder ?? 0));
      if (data.image) {
        formData.append("image", data.image);
      }
      if (data.gallery && data.gallery.length > 0) {
        data.gallery.forEach((file) => {
          formData.append("gallery", file);
        });
      }
      if (data.existingGallery) {
        formData.append("existingGallery", JSON.stringify(data.existingGallery));
      }
      if (data.description !== undefined) {
        formData.append("description", data.description);
      }

      const res = await fetch("/api/room-types", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create room type");
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room-types"] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RoomTypeDataInput) => {
      if (!data.id) throw new Error("Room Type ID is required for update.");
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("startingPrice", String(data.startingPrice));
      formData.append("size", data.size);
      formData.append("view", data.view);
      formData.append("bedType", data.bedType);
      formData.append("bathrooms", data.bathrooms);
      formData.append("amenities", JSON.stringify(data.amenities));
      formData.append("ratePlans", JSON.stringify(data.ratePlans));
      formData.append("sortOrder", String(data.sortOrder ?? 0));
      if (data.image) {
        formData.append("image", data.image);
      }
      if (data.gallery && data.gallery.length > 0) {
        data.gallery.forEach((file) => {
          formData.append("gallery", file);
        });
      }
      if (data.existingGallery) {
        formData.append("existingGallery", JSON.stringify(data.existingGallery));
      }
      if (data.description !== undefined) {
        formData.append("description", data.description);
      }

      const res = await fetch(`/api/room-types/${data.id}`, {
        method: "PUT",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update room type");
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room-types"] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/room-types/${id}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete room type");
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room-types"] });
    },
  });
}
