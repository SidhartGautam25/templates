"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, Copy, Loader2, Palette, Save } from "lucide-react";

import { THEME_PRESETS } from "@/lib/theme/presets";
import { THEME_COLOR_FIELDS, type ThemeColors } from "@/lib/theme/types";

function PreviewCard({ colors }: { colors: ThemeColors }) {
  return (
    <div
      className="rounded-2xl border p-6 space-y-4 shadow-sm"
      style={{
        background: colors.bgMain,
        borderColor: colors.accentLight,
        color: colors.textMain,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold"
          style={{ background: colors.primary }}
        >
          Logo
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: colors.textMain }}>Brand preview</p>
          <p className="text-xs" style={{ color: colors.textMuted }}>Live theme sample</p>
        </div>
      </div>
      <div
        className="rounded-xl p-4 space-y-2"
        style={{ background: colors.bgCard, border: `1px solid ${colors.accentLight}` }}
      >
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: colors.accentDark }}>
          Accent highlight
        </p>
        <p className="text-sm" style={{ color: colors.textMain }}>
          Primary navigation and sidebar use your primary palette.
        </p>
        <button
          type="button"
          className="px-4 py-2 rounded-lg text-xs font-bold text-white"
          style={{ background: colors.ctaPrimary }}
        >
          Call to action
        </button>
      </div>
      <div
        className="rounded-lg px-3 py-2 text-[10px] font-medium text-center"
        style={{ background: colors.footerBg, color: colors.textMuted }}
      >
        Footer background
      </div>
    </div>
  );
}

export default function ThemeEditor() {
  const [colors, setColors] = useState<ThemeColors | null>(null);
  const [exportSiteTs, setExportSiteTs] = useState("");
  const [exportCss, setExportCss] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const loadTheme = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/theme");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to load theme");
      setColors(json.data.colors);
      setExportSiteTs(json.data.export?.siteTs ?? "");
      setExportCss(json.data.export?.globalsCss ?? "");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to load theme");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  const previewColors = useMemo(() => colors ?? THEME_PRESETS[0].colors, [colors]);

  const applyPreset = (presetId: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (preset) setColors({ ...preset.colors });
  };

  const updateColor = (key: keyof ThemeColors, value: string) => {
    if (!colors) return;
    setColors({ ...colors, [key]: value });
  };

  const handleSave = async () => {
    if (!colors) return;
    setIsSaving(true);
    setErrorMsg("");
    setSuccess(false);
    try {
      const res = await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ colors }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to save theme");
      setExportSiteTs(json.data.export?.siteTs ?? "");
      setExportCss(json.data.export?.globalsCss ?? "");
      setSuccess(true);

      const root = document.documentElement;
      for (const field of THEME_COLOR_FIELDS) {
        root.style.setProperty(field.cssVar, colors[field.key]);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save theme");
    } finally {
      setIsSaving(false);
    }
  };

  const copyText = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setErrorMsg("Clipboard copy failed");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-text-muted">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!colors) {
    return (
      <div className="p-6 text-center text-red-600 flex items-center justify-center gap-2">
        <AlertCircle className="w-5 h-5" />
        {errorMsg || "Theme data unavailable"}
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Visual theme editor
          </h3>
          <p className="text-xs text-text-muted mt-1">
            Pick colors or presets. Save writes constants/site.ts and app/globals.css CSS variables.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:opacity-95 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save theme
        </button>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 text-red-600 text-xs font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-medium bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
          <Check className="w-4 h-4 shrink-0" />
          Theme saved. CSS variables apply immediately; restart dev if site.ts values look stale.
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">Presets</p>
            <div className="flex flex-wrap gap-2">
              {THEME_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.id)}
                  className="px-3 py-2 rounded-xl border border-primary/10 text-[10px] font-bold hover:border-primary/30 cursor-pointer"
                  style={{
                    background: preset.colors.bgMain,
                    color: preset.colors.primary,
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {THEME_COLOR_FIELDS.map((field) => (
              <label key={field.key} className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  {field.label}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colors[field.key]}
                    onChange={(e) => updateColor(field.key, e.target.value)}
                    className="w-10 h-10 rounded-lg border border-primary/10 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={colors[field.key]}
                    onChange={(e) => updateColor(field.key, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-primary/10 text-xs font-mono bg-white"
                  />
                </div>
              </label>
            ))}
          </div>
        </div>

        <PreviewCard colors={previewColors} />
      </div>

      <div className="space-y-4 border-t border-primary/10 pt-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Export snippets</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary">constants/site.ts</span>
              <button
                type="button"
                onClick={() => copyText("site", exportSiteTs)}
                className="text-[10px] font-bold text-primary flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                {copied === "site" ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="text-[10px] bg-bg-light rounded-xl p-3 overflow-x-auto font-mono border border-primary/5">
              {exportSiteTs}
            </pre>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary">app/globals.css</span>
              <button
                type="button"
                onClick={() => copyText("css", exportCss)}
                className="text-[10px] font-bold text-primary flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                {copied === "css" ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="text-[10px] bg-bg-light rounded-xl p-3 overflow-x-auto font-mono border border-primary/5">
              {exportCss}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
