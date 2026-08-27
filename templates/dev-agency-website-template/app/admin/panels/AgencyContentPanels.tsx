"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

function useAgencyList(endpoint: string) {
  return useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      const res = await fetch(endpoint);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to load");
      return json.data as Array<Record<string, unknown> & { id: string }>;
    },
  });
}

function useAgencyMutations(endpoint: string) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: [endpoint] });

  const create = useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Create failed");
      return json.data;
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: Record<string, unknown> }) => {
      const res = await fetch(`${endpoint}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Update failed");
      return json.data;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Delete failed");
      return json.data;
    },
    onSuccess: invalidate,
  });

  return { create, update, remove };
}

export function AgencyExpertisePanel() {
  const endpoint = "/api/agency/expertise";
  const { data = [], isLoading } = useAgencyList(endpoint);
  const { create, update, remove } = useAgencyMutations(endpoint);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleAdd() {
    if (!title.trim()) return;
    await create.mutateAsync({
      title,
      description,
      iconKey: "code",
      published: true,
    });
    setTitle("");
    setDescription("");
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h3 className="text-lg font-bold text-primary">Expertise cards</h3>
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <ul className="space-y-2">
          {data.map((row) => (
            <li
              key={row.id}
              className="flex items-center justify-between gap-4 border border-primary/10 rounded-lg px-4 py-3"
            >
              <div>
                <p className="font-bold text-sm">{String(row.title)}</p>
                <p className="text-xs text-text-muted line-clamp-1">{String(row.description)}</p>
              </div>
              {!String(row.id).startsWith("default-") && (
                <button
                  type="button"
                  onClick={() => remove.mutate(String(row.id))}
                  className="text-red-600 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="space-y-2 border-t border-primary/10 pt-4">
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm min-h-[80px]"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={create.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add expertise
        </button>
      </div>
    </div>
  );
}

export function AgencyTeamPanel() {
  const endpoint = "/api/agency/team";
  const { data = [], isLoading } = useAgencyList(endpoint);
  const { create, remove } = useAgencyMutations(endpoint);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  async function handleAdd() {
    if (!name.trim()) return;
    await create.mutateAsync({ name, role, avatarColor: "blue", published: true });
    setName("");
    setRole("");
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h3 className="text-lg font-bold text-primary">Team members</h3>
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <ul className="space-y-2">
          {data.map((row) => (
            <li
              key={row.id}
              className="flex items-center justify-between gap-4 border border-primary/10 rounded-lg px-4 py-3"
            >
              <div>
                <p className="font-bold text-sm">{String(row.name)}</p>
                <p className="text-xs text-text-muted">{String(row.role)}</p>
              </div>
              {!String(row.id).startsWith("default-") && (
                <button
                  type="button"
                  onClick={() => remove.mutate(String(row.id))}
                  className="text-red-600 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="space-y-2 border-t border-primary/10 pt-4">
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add member
        </button>
      </div>
    </div>
  );
}

export function AgencyWorkPanel() {
  const endpoint = "/api/agency/work";
  const { data = [], isLoading } = useAgencyList(endpoint);
  const { create, remove } = useAgencyMutations(endpoint);
  const [clientName, setClientName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [category, setCategory] = useState("Web Project");
  const [review, setReview] = useState("");

  async function handleAdd() {
    if (!clientName.trim() || !websiteUrl.trim()) return;
    await create.mutateAsync({
      clientName,
      websiteUrl,
      category,
      review,
      gradient: "purple",
      published: true,
    });
    setClientName("");
    setWebsiteUrl("");
    setReview("");
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h3 className="text-lg font-bold text-primary">Featured work</h3>
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <ul className="space-y-2">
          {data.map((row) => (
            <li
              key={row.id}
              className="flex items-center justify-between gap-4 border border-primary/10 rounded-lg px-4 py-3"
            >
              <div>
                <p className="font-bold text-sm">{String(row.clientName)}</p>
                <p className="text-xs text-text-muted">{String(row.websiteUrl)}</p>
              </div>
              {!String(row.id).startsWith("default-") && (
                <button
                  type="button"
                  onClick={() => remove.mutate(String(row.id))}
                  className="text-red-600 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="space-y-2 border-t border-primary/10 pt-4">
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Client / site name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="https://..."
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
        />
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Short review (optional)"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add project
        </button>
      </div>
    </div>
  );
}
