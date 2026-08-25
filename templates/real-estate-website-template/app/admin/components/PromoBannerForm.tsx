"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Check, AlertCircle } from "lucide-react";

export default function PromoBannerForm() {
  const [sec1Title, setSec1Title] = useState("");
  const [sec1Sub, setSec1Sub] = useState("");
  const [sec2Title, setSec2Title] = useState("");
  const [sec2Sub, setSec2Sub] = useState("");
  const [sec3Title, setSec3Title] = useState("");
  const [sec3Sub, setSec3Sub] = useState("");
  const [sec4Title, setSec4Title] = useState("");
  const [sec4Sub, setSec4Sub] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [bannerLogs, setBannerLogs] = useState<string[]>([]);

  useEffect(() => {
    async function fetchBannerSettings() {
      try {
        const res = await fetch("/api/promo-banner");
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setSec1Title(d.sec1Title || "");
          setSec1Sub(d.sec1Sub || "");
          setSec2Title(d.sec2Title || "");
          setSec2Sub(d.sec2Sub || "");
          setSec3Title(d.sec3Title || "");
          setSec3Sub(d.sec3Sub || "");
          setSec4Title(d.sec4Title || "");
          setSec4Sub(d.sec4Sub || "");
          setImagePreview(d.imageUrl || "");
        }
      } catch (err: any) {
        setErrorMsg("Failed to load current promo settings.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchBannerSettings();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccess(false);
    setBannerLogs([]);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("sec1Title", sec1Title);
    formData.append("sec1Sub", sec1Sub);
    formData.append("sec2Title", sec2Title);
    formData.append("sec2Sub", sec2Sub);
    formData.append("sec3Title", sec3Title);
    formData.append("sec3Sub", sec3Sub);
    formData.append("sec4Title", sec4Title);
    formData.append("sec4Sub", sec4Sub);
    
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await fetch("/api/promo-banner", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to save promo settings.");
      }

      setSuccess(true);
      setBannerLogs(json.logs || []);
      if (json.data && json.data.imageUrl) {
        setImagePreview(json.data.imageUrl);
        setImageFile(null);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-black/[0.06] rounded-2xl p-12 text-center text-text-muted flex flex-col items-center justify-center space-y-3">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <span className="text-xs font-bold tracking-wider uppercase text-text-muted">
          Loading promo banner configurations...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-black/[0.06] rounded-3xl shadow-sm overflow-hidden p-6 md:p-8 space-y-8 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold font-serif text-primary border-b border-black/[0.04] pb-3">
          Promo Banner Settings
        </h2>
        <p className="text-[11px] text-text-muted mt-1.5">
          Manage the promotional banner image and the four highlights cards displayed on the homepage below the hero area.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-2xl space-y-2 flex flex-col justify-start">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>Promo banner settings saved successfully!</span>
          </div>
          {bannerLogs && bannerLogs.length > 0 && (
            <div className="pl-6 border-l-2 border-green-300 text-[10px] text-green-600 font-normal space-y-1 mt-1">
              <span className="font-bold block text-[9px] uppercase tracking-wider text-green-700">FTP Activity:</span>
              {bannerLogs.map((log, i) => (
                <div key={i}>• {log}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Banner Image Preview & Upload */}
        <div className="space-y-3">
          <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold">
            Banner Image
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 border border-black/[0.06] rounded-2xl bg-bg-tan/10">
            {imagePreview && (
              <div className="relative w-full max-w-xs h-[100px] border border-black/[0.08] rounded-xl overflow-hidden bg-white flex items-center justify-center p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Promo Banner Preview" className="max-h-full max-w-full object-contain" />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-xs text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white file:cursor-pointer hover:file:opacity-90"
              />
              <p className="text-[10px] text-text-muted mt-2 leading-relaxed">
                Recommended aspect ratio: 3:1 (wide banner). Acceptable format: PNG, JPEG, SVG.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Columns Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-black/[0.04]">
          
          {/* Card 1 */}
          <div className="p-4 border border-black/[0.04] rounded-2xl space-y-4">
            <span className="text-[10px] font-bold text-accent-gold-dark uppercase tracking-widest block">
              Highlight Column 1
            </span>
            <div className="space-y-3">
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Premium 2, 3 & 4 BHK"
                  value={sec1Title}
                  onChange={(e) => setSec1Title(e.target.value)}
                  className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent-gold"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Starting At ₹82 Lacs*"
                  value={sec1Sub}
                  onChange={(e) => setSec1Sub(e.target.value)}
                  className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent-gold"
                />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-4 border border-black/[0.04] rounded-2xl space-y-4">
            <span className="text-[10px] font-bold text-accent-gold-dark uppercase tracking-widest block">
              Highlight Column 2
            </span>
            <div className="space-y-3">
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. At Prime Locations"
                  value={sec2Title}
                  onChange={(e) => setSec2Title(e.target.value)}
                  className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent-gold"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Of Pune"
                  value={sec2Sub}
                  onChange={(e) => setSec2Sub(e.target.value)}
                  className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent-gold"
                />
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-4 border border-black/[0.04] rounded-2xl space-y-4">
            <span className="text-[10px] font-bold text-accent-gold-dark uppercase tracking-widest block">
              Highlight Column 3
            </span>
            <div className="space-y-3">
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Introducing The"
                  value={sec3Title}
                  onChange={(e) => setSec3Title(e.target.value)}
                  className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent-gold"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1% Payment Plan"
                  value={sec3Sub}
                  onChange={(e) => setSec3Sub(e.target.value)}
                  className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent-gold"
                />
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-4 border border-black/[0.04] rounded-2xl space-y-4">
            <span className="text-[10px] font-bold text-accent-gold-dark uppercase tracking-widest block">
              Highlight Column 4
            </span>
            <div className="space-y-3">
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Launch"
                  value={sec4Title}
                  onChange={(e) => setSec4Title(e.target.value)}
                  className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent-gold"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Projects"
                  value={sec4Sub}
                  onChange={(e) => setSec4Sub(e.target.value)}
                  className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent-gold"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-black/[0.04]">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-primary text-white font-bold text-xs tracking-wider rounded-xl hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center space-x-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Configurations</span>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
