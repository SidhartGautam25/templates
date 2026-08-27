import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface ProjectDataInput {
  id?: string;
  name: string;
  location: string;
  typology: string;
  price: string;
  image?: File | null;
  possession?: string;
  tag1?: string;
  tag2?: string;
  highlights: string[];
  rera: string;
  reraId?: string | null;
  reraLabel?: string | null;
  reraQrImage?: File | null;
  category: "apartments" | "plots";
  description?: string;
  amenities?: string[];
  galleryUrls?: string[];
  galleryFiles?: File[];
  floorPlans?: { title: string; size: string; image?: string; file?: File | null }[];
  isNewLaunch?: boolean;
  sortOrder?: number;
}

export function useGetProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load projects");
      return json.data;
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProjectDataInput) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("location", data.location);
      formData.append("typology", data.typology);
      formData.append("price", data.price);
      formData.append("rera", data.rera);
      if (data.reraId) formData.append("reraId", data.reraId);
      if (data.reraLabel) formData.append("reraLabel", data.reraLabel);
      if (data.reraQrImage) formData.append("reraQrImage", data.reraQrImage);
      formData.append("category", data.category);
      if (data.possession) formData.append("possession", data.possession);
      if (data.tag1) formData.append("tag1", data.tag1);
      if (data.tag2) formData.append("tag2", data.tag2);
      formData.append("highlights", JSON.stringify(data.highlights));
      formData.append("isNewLaunch", String(data.isNewLaunch ?? false));
      formData.append("sortOrder", String(data.sortOrder ?? 0));
      if (data.image) {
        formData.append("image", data.image);
      }

      if (data.description) formData.append("description", data.description);
      if (data.amenities) formData.append("amenities", JSON.stringify(data.amenities));
      if (data.galleryUrls) formData.append("galleryUrls", JSON.stringify(data.galleryUrls));
      
      data.galleryFiles?.forEach((file) => {
        formData.append("galleryFiles", file);
      });

      const serializedFloorPlans = data.floorPlans?.map((fp, idx) => ({
        title: fp.title,
        size: fp.size,
        image: fp.image || "",
        tempIndex: idx,
      })) || [];
      formData.append("floorPlans", JSON.stringify(serializedFloorPlans));

      data.floorPlans?.forEach((fp, idx) => {
        if (fp.file) {
          formData.append(`floorPlanFile_${idx}`, fp.file);
        }
      });

      const res = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create project");
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProjectDataInput) => {
      if (!data.id) throw new Error("Project ID is required for update.");
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("location", data.location);
      formData.append("typology", data.typology);
      formData.append("price", data.price);
      formData.append("rera", data.rera);
      formData.append("reraId", data.reraId || "");
      formData.append("reraLabel", data.reraLabel || "");
      if (data.reraQrImage) formData.append("reraQrImage", data.reraQrImage);
      formData.append("category", data.category);
      formData.append("possession", data.possession || "");
      formData.append("tag1", data.tag1 || "");
      formData.append("tag2", data.tag2 || "");
      formData.append("highlights", JSON.stringify(data.highlights));
      formData.append("isNewLaunch", String(data.isNewLaunch ?? false));
      formData.append("sortOrder", String(data.sortOrder ?? 0));
      if (data.image) {
        formData.append("image", data.image);
      }

      if (data.description !== undefined) formData.append("description", data.description || "");
      if (data.amenities) formData.append("amenities", JSON.stringify(data.amenities));
      if (data.galleryUrls) formData.append("galleryUrls", JSON.stringify(data.galleryUrls));
      
      data.galleryFiles?.forEach((file) => {
        formData.append("galleryFiles", file);
      });

      const serializedFloorPlans = data.floorPlans?.map((fp, idx) => ({
        title: fp.title,
        size: fp.size,
        image: fp.image || "",
        tempIndex: idx,
      })) || [];
      formData.append("floorPlans", JSON.stringify(serializedFloorPlans));

      data.floorPlans?.forEach((fp, idx) => {
        if (fp.file) {
          formData.append(`floorPlanFile_${idx}`, fp.file);
        }
      });

      const res = await fetch(`/api/projects/${data.id}`, {
        method: "PUT",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update project");
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete project");
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
