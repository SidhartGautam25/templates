import { useQuery } from "@tanstack/react-query";

export interface LeadData {
  id: string;
  roomTypeName: string;
  name: string;
  email: string;
  phone: string;
  message?: string | null;
  createdAt: string;
}

export function useGetLeads() {
  return useQuery<LeadData[]>({
    queryKey: ["leads"],
    queryFn: async () => {
      const res = await fetch("/api/leads");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load leads");
      return json.data;
    },
  });
}
