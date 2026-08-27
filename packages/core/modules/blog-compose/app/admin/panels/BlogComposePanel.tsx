"use client";

import React, { useMemo, useState } from "react";
import { Loader2, Plus, Trash2, ChevronUp, ChevronDown, Save } from "lucide-react";
import {
  COMPOSE_BLOCK_TYPES,
  ComposeBlogRenderer,
  createEmptyComposeDocument,
  getComposeBlockDefinition,
  isComposeDocument,
  type ComposeBlock,
  type ComposeDocument,
} from "@/lib/blog/compose";
import {
  useCreateBlogPost,
  useDeleteBlogPost,
  useGetBlogPosts,
  useUpdateBlogPost,
  type BlogPostData,
} from "../hooks/useBlogPosts";
import { blockToFormValues, formValuesToBlock } from "./blog-compose-form";

function BlockFieldEditor({
  block,
  onChange,
}: {
  block: ComposeBlock;
  onChange: (block: ComposeBlock) => void;
}) {
  const def = getComposeBlockDefinition(block.type);
  const values = blockToFormValues(block);

  function update(key: string, value: string) {
    const nextValues = { ...values, [key]: value };
    onChange(formValuesToBlock(block.type, nextValues));
  }

  return (
    <div className="space-y-4">
      {def.fields.map((field) => {
        if (field.input === "toggle") {
          return (
            <label key={field.key} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={values[field.key] === "true"}
                onChange={(e) => update(field.key, e.target.checked ? "true" : "false")}
              />
              <span className="font-medium">{field.label}</span>
            </label>
          );
        }
        if (field.input === "select") {
          return (
            <div key={field.key}>
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                {field.label}
              </label>
              <select
                className="mt-1 w-full border border-primary/20 rounded-lg px-3 py-2 text-sm"
                value={values[field.key]}
                onChange={(e) => update(field.key, e.target.value)}
              >
                {field.options?.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          );
        }
        const isTextarea = field.input === "textarea" || field.input === "tags";
        return (
          <div key={field.key}>
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
              {field.label}
            </label>
            {field.description && (
              <p className="text-[10px] text-text-muted mt-0.5">{field.description}</p>
            )}
            {isTextarea ? (
              <textarea
                className="mt-1 w-full border border-primary/20 rounded-lg px-3 py-2 text-sm min-h-[80px]"
                value={values[field.key]}
                placeholder={field.placeholder}
                onChange={(e) => update(field.key, e.target.value)}
              />
            ) : (
              <input
                className="mt-1 w-full border border-primary/20 rounded-lg px-3 py-2 text-sm"
                value={values[field.key]}
                placeholder={field.placeholder}
                onChange={(e) => update(field.key, e.target.value)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function BlogComposePanel() {
  const { data: posts = [], isLoading } = useGetBlogPosts();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [published, setPublished] = useState(false);
  const [document, setDocument] = useState<ComposeDocument>(createEmptyComposeDocument());
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
  const [error, setError] = useState("");

  const previewDoc = useMemo(() => document, [document]);

  function startNew() {
    setEditingId(null);
    setEditorOpen(true);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setPublished(false);
    setDocument(createEmptyComposeDocument());
    setSelectedBlockIndex(null);
    setError("");
  }

  function startEdit(post: BlogPostData & { id: string }) {
    setEditingId(post.id);
    setEditorOpen(true);
    setTitle(post.title);
    setSlug(post.slug ?? "");
    setExcerpt(post.excerpt ?? "");
    setPublished(post.published ?? false);
    setDocument(isComposeDocument(post.content) ? post.content : createEmptyComposeDocument());
    setSelectedBlockIndex(null);
    setError("");
  }

  function addBlock(type: ComposeBlock["type"]) {
    const def = getComposeBlockDefinition(type);
    const blocks = [...document.blocks, def.createDefault()];
    setDocument({ ...document, blocks });
    setSelectedBlockIndex(blocks.length - 1);
  }

  function moveBlock(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= document.blocks.length) return;
    const blocks = [...document.blocks];
    const [item] = blocks.splice(index, 1);
    blocks.splice(next, 0, item);
    setDocument({ ...document, blocks });
    setSelectedBlockIndex(next);
  }

  function removeBlock(index: number) {
    const blocks = document.blocks.filter((_, i) => i !== index);
    setDocument({ ...document, blocks });
    setSelectedBlockIndex(null);
  }

  function updateBlock(index: number, block: ComposeBlock) {
    const blocks = [...document.blocks];
    blocks[index] = block;
    setDocument({ ...document, blocks });
  }

  async function handleSave() {
    setError("");
    const payload: BlogPostData = {
      title,
      slug: slug || undefined,
      excerpt: excerpt || null,
      published,
      content: document,
    };
    try {
      if (editingId) {
        await updatePost.mutateAsync({ id: editingId, data: payload });
      } else {
        await createPost.mutateAsync(payload);
      }
      startNew();
      setEditorOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  const saving = createPost.isPending || updatePost.isPending;
  const selectedBlock =
    selectedBlockIndex != null ? document.blocks[selectedBlockIndex] : null;

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-primary">Compose Blog Engine</h3>
          <p className="text-xs text-text-muted mt-1">
            Build articles from typed blocks — JSON stored in the database, rendered by the compose interpreter.
          </p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New article
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
        </div>
      ) : (
        <div className="rounded-xl border border-primary/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg-light text-left text-[10px] font-bold uppercase tracking-widest text-text-muted">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 w-24" />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-t border-primary/5">
                  <td className="px-4 py-3 font-medium">{post.title}</td>
                  <td className="px-4 py-3 text-text-muted">{post.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                        post.published
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-bg-light text-text-muted"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(post as BlogPostData & { id: string })}
                      className="text-xs font-bold text-primary cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => post.id && deletePost.mutate(post.id)}
                      className="text-xs font-bold text-red-600 cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(editorOpen || editingId !== null) && (
        <div className="grid lg:grid-cols-2 gap-8 border-t border-primary/10 pt-8">
          <div className="space-y-6">
            <h4 className="font-bold text-primary">Article meta</h4>
            {error && (
              <div className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            <input
              className="w-full border border-primary/20 rounded-lg px-3 py-2 text-sm"
              placeholder="Title*"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="w-full border border-primary/20 rounded-lg px-3 py-2 text-sm"
              placeholder="Slug (optional — auto from title)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <textarea
              className="w-full border border-primary/20 rounded-lg px-3 py-2 text-sm resize-none"
              placeholder="Excerpt (listing cards)"
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              Publish on save
            </label>

            <div className="border-t border-primary/10 pt-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Add block</span>
                {COMPOSE_BLOCK_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addBlock(type)}
                    className="px-3 py-1.5 rounded-lg border border-primary/15 text-[10px] font-bold uppercase tracking-wide hover:bg-bg-light cursor-pointer"
                  >
                    {getComposeBlockDefinition(type).label}
                  </button>
                ))}
              </div>

              <ul className="space-y-2">
                {document.blocks.map((block, index) => (
                  <li
                    key={index}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
                      selectedBlockIndex === index
                        ? "border-primary bg-primary/5"
                        : "border-primary/10"
                    }`}
                  >
                    <button
                      type="button"
                      className="flex-1 text-left text-xs font-bold cursor-pointer"
                      onClick={() => setSelectedBlockIndex(index)}
                    >
                      {getComposeBlockDefinition(block.type).label}
                      <span className="text-text-muted font-normal ml-2 truncate">
                        {(block as { text?: string; command?: string; code?: string }).text?.slice(0, 40) ||
                          (block as { command?: string }).command?.slice(0, 40) ||
                          (block as { code?: string }).code?.slice(0, 40) ||
                          ""}
                      </span>
                    </button>
                    <button type="button" onClick={() => moveBlock(index, -1)} className="p-1 cursor-pointer">
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => moveBlock(index, 1)} className="p-1 cursor-pointer">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => removeBlock(index)} className="p-1 text-red-600 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>

              {selectedBlock && selectedBlockIndex !== null && (
                <div className="mt-6 p-4 rounded-xl border border-primary/10 bg-bg-light">
                  <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">
                    Edit {getComposeBlockDefinition(selectedBlock.type).label}
                  </p>
                  <BlockFieldEditor
                    block={selectedBlock}
                    onChange={(b) => updateBlock(selectedBlockIndex, b)}
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={saving || !title.trim()}
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl disabled:opacity-50 cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save article
            </button>
          </div>

          <div className="rounded-xl border border-primary/10 bg-bg-card p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4">Live preview</p>
            <ComposeBlogRenderer document={previewDoc} />
          </div>
        </div>
      )}
    </div>
  );
}
