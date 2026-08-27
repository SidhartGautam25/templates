"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Check, AlertCircle, Upload, RotateCcw, Image as ImageIcon } from "lucide-react";

export default function LaunchLogoForm() {
  const [logoPreview, setLogoPreview] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [logoLogs, setLogoLogs] = useState<string[]>([]);

  const fetchLogoSettings = async () => {
    try {
      const res = await fetch("/api/promo-banner");
      const json = await res.json();
      if (json.success && json.data) {
        setLogoPreview(json.data.newLaunchLogoUrl || "");
      }
    } catch (err: any) {
      setErrorMsg("Failed to load current launch logo settings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogoSettings();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleResetToDefault = async () => {
    if (!confirm("Are you sure you want to reset to the default circular stamp? This will remove the custom logo.")) {
      return;
    }

    setErrorMsg("");
    setSuccess(false);
    setLogoLogs([]);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("resetLaunchLogo", "true");

    try {
      const res = await fetch("/api/promo-banner", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to reset launch logo.");
      }

      setSuccess(true);
      setLogoLogs(json.logs || []);
      setLogoPreview("");
      setLogoFile(null);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoFile) {
      setErrorMsg("Please select an image file to upload first.");
      return;
    }

    setErrorMsg("");
    setSuccess(false);
    setLogoLogs([]);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("launchLogo", logoFile);

    try {
      const res = await fetch("/api/promo-banner", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to upload launch logo.");
      }

      setSuccess(true);
      setLogoLogs(json.logs || []);
      if (json.data && json.data.newLaunchLogoUrl) {
        setLogoPreview(json.data.newLaunchLogoUrl);
        setLogoFile(null);
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
          Loading launch logo configurations...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-black/[0.06] rounded-3xl shadow-sm overflow-hidden p-6 md:p-8 space-y-8 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold font-serif text-primary border-b border-black/[0.04] pb-3">
          New Launch Logo Control
        </h2>
        <p className="text-[11px] text-text-muted mt-1.5 leading-relaxed">
          Manage the badge design for projects marked as "New Launch". You can upload a custom logo (PNG/JPEG/SVG) to replace the default ink stamp, or reset back to default at any time.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-2xl space-y-2 flex flex-col justify-start">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>Launch logo configuration saved successfully!</span>
          </div>
          {logoLogs && logoLogs.length > 0 && (
            <div className="pl-6 border-l-2 border-green-300 text-[10px] text-green-600 font-normal space-y-1 mt-1">
              <span className="font-bold block text-[9px] uppercase tracking-wider text-green-700">FTP Activity:</span>
              {logoLogs.map((log, i) => (
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
        
        {/* Logo Preview & Upload */}
        <div className="space-y-3">
          <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold">
            Current Custom Launch Logo
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-6 p-5 border border-black/[0.06] rounded-2xl bg-bg-tan/10">
            {/* Preview Area */}
            <div className="relative w-28 h-28 border border-black/[0.08] rounded-2xl overflow-hidden bg-white flex flex-col items-center justify-center p-3 shadow-inner">
              {logoPreview ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={logoPreview} alt="Launch Logo Preview" className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="text-center space-y-1 p-1">
                  {/* Default Circular stamped badge representation */}
                  <div className="w-10 h-10 rounded-full border-2 border-double border-red-600 flex flex-col items-center justify-center mx-auto text-red-600 opacity-60">
                    <span className="text-[3px] font-bold leading-none scale-[0.7]">GODREJ</span>
                    <span className="text-[4px] font-black border-y border-red-600 leading-none my-[1px] scale-[0.8]">NEW</span>
                    <span className="text-[3px] font-bold leading-none scale-[0.7]">PROP</span>
                  </div>
                  <span className="text-[8px] font-extrabold text-red-600 uppercase block tracking-wider leading-none mt-1 opacity-70">
                    Default Stamp
                  </span>
                </div>
              )}
            </div>

            {/* Input & Instructions */}
            <div className="flex-1 w-full space-y-3">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-black/[0.12] hover:border-accent-gold rounded-2xl p-4 cursor-pointer text-center group transition-colors bg-white">
                <Upload className="w-6 h-6 text-text-muted group-hover:text-accent-gold-dark transition-colors mb-1.5" />
                <span className="text-xs font-bold text-primary group-hover:text-accent-gold-dark">
                  Click to select new image logo
                </span>
                <span className="text-[9px] text-text-muted mt-1 block">
                  PNG, JPG, JPEG, SVG formats
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-[10px] text-text-muted leading-relaxed">
                Recommended size: Square aspect ratio (e.g. 150x150 pixels). Transparent background PNG/SVG files look best on project cards.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-black/[0.04]">
          <div>
            {logoPreview && (
              <button
                type="button"
                onClick={handleResetToDefault}
                disabled={isSubmitting}
                className="px-4 py-2 border border-red-200 text-red-600 font-bold text-xs tracking-wider rounded-xl hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-50 flex items-center space-x-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default Stamp</span>
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !logoFile}
            className="w-full sm:w-auto px-6 py-2.5 bg-primary text-white font-bold text-xs tracking-wider rounded-xl hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Upload Custom Logo</span>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
