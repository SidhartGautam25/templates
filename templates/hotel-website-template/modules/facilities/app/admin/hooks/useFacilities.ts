import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface FacilityDataInput {
  id?: string;
  title: string;
  description: string;
  icon: string;
  sortOrder: number;
}

export function useGetFacilities() {
  return useQuery({
    queryKey: ["facilities"],
    queryFn: async () => {
      const res = await fetch("/api/facilities");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load facilities");
      return json.data;
    },
  });
}

export function useCreateFacility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FacilityDataInput) => {
      const res = await fetch("/api/facilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create facility");
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
    },
  });
}

export function useUpdateFacility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FacilityDataInput) => {
      if (!data.id) throw new Error("Facility ID is required for update.");
      const res = await fetch(`/api/facilities/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update facility");
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
    },
  });
}

export function useDeleteFacility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/facilities/${id}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete facility");
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
    },
  });
}
