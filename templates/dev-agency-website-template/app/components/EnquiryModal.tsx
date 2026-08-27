"use client";

import React, { useState, useEffect } from "react";
import { SITE } from "@/constants";

export interface ListingOption {
  id?: string;
  name: string;
}

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSelection?: string;
}

export default function EnquiryModal({
  isOpen,
  onClose,
  defaultSelection = "",
}: EnquiryModalProps) {
  const [name, setName] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    message: "",
    selection: "",
  });

  const [options, setOptions] = useState<ListingOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const staticOptions: ListingOption[] = SITE.enquiry.selectionOptions.map((opt) => ({
    name: opt.value,
  }));

  useEffect(() => {
    const apiPath = SITE.enquiry.listingsApiPath?.trim();
    if (!apiPath) {
      setOptions(staticOptions);
      return;
    }

    async function fetchListings() {
      try {
        const res = await fetch(apiPath);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setOptions(
            json.data.map((item: { id?: string; name: string }) => ({
              id: item.id,
              name: item.name,
            }))
          );
        } else {
          setOptions(staticOptions);
        }
      } catch (err) {
        console.warn("Failed to fetch listings for enquiry modal:", err);
        setOptions(staticOptions);
      }
    }

    fetchListings();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const available = options.length > 0 ? options : staticOptions;
    const isValid = available.some((o) => o.name === defaultSelection);
    const fallback = available[0]?.name ?? "";

    setFormData((prev) => ({
      ...prev,
      selection: defaultSelection && isValid ? defaultSelection : prev.selection || fallback,
      message:
        defaultSelection && !isValid && defaultSelection
          ? `Request for: ${defaultSelection}`
          : prev.message,
    }));

    setName("");
    setIsSuccess(false);
    setError("");
  }, [isOpen, defaultSelection, options]);

  if (!isOpen) return null;

  const selectionOptions = options.length > 0 ? options : staticOptions;
  const showSelection = selectionOptions.length > 0;
  const selectionLabel = SITE.enquiry.selectionLabel || "Interest";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Please enter your name.");
    if (showSelection && !formData.selection) {
      return setError(`Please select ${selectionLabel.toLowerCase()}.`);
    }
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, "").length < 10) {
      return setError("Please enter a valid 10-digit phone number.");
    }

    setIsSubmitting(true);

    try {
      const projectName = showSelection
        ? formData.selection
        : formData.message.trim() || SITE.brand.name;

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName,
          name: name.trim(),
          email: formData.email,
          phone: formData.phone,
          message: formData.message || `Request callback for ${projectName}`,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to submit enquiry.");
      }

      setIsSuccess(true);
      setFormData({ email: "", phone: "", message: "", selection: "" });
      setName("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name: field, value } = e.target;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-8 sm:p-10 shadow-2xl border border-primary/10 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-text-muted hover:text-primary transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 animate-bounce">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-primary">Request submitted!</h4>
            <p className="text-sm text-text-muted max-w-sm leading-relaxed">{SITE.enquiry.successMessage}</p>
            <button
              onClick={onClose}
              className="mt-6 px-8 py-2.5 bg-cta-primary hover:bg-cta-primary-hover text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-primary tracking-tight leading-tight font-serif">
                {SITE.enquiry.modalTitle}
              </h3>
              <p className="text-xs text-text-muted font-semibold mt-1.5">{SITE.enquiry.modalSubtitle}</p>
            </div>

            {error && (
              <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">{error}</div>
            )}

            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name*"
                className="w-full bg-transparent border-b border-primary/20 focus:border-primary focus:outline-none py-2 text-sm text-text-main placeholder-text-muted/60 font-medium transition-colors"
                required
              />
            </div>

            <div>
              <div className="flex items-center border-b border-primary/20 focus-within:border-primary py-1 transition-colors">
                <div className="flex items-center space-x-1 pr-2 select-none mr-2 border-r border-primary/10">
                  <span className="text-sm">🇮🇳</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number*"
                  className="w-full bg-transparent focus:outline-none text-sm text-text-main placeholder-text-muted/60 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email (optional)"
                className="w-full bg-transparent border-b border-primary/20 focus:border-primary focus:outline-none py-2 text-sm text-text-main placeholder-text-muted/60 font-medium transition-colors"
              />
            </div>

            {showSelection && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-text-muted">{selectionLabel}*</label>
                <div className="relative">
                  <select
                    name="selection"
                    value={formData.selection}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-primary/20 focus:border-primary focus:outline-none py-2 text-sm text-text-main font-medium appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select</option>
                    {selectionOptions.map((opt) => (
                      <option key={opt.id ?? opt.name} value={opt.name}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {!showSelection && (
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message (optional)"
                  rows={2}
                  className="w-full bg-transparent border-b border-primary/20 focus:border-primary focus:outline-none py-2 text-sm text-text-main placeholder-text-muted/60 font-medium transition-colors resize-none"
                />
              </div>
            )}

            <div className="flex items-start mt-6">
              <input
                type="checkbox"
                id="consent"
                required
                defaultChecked
                className="mt-1 mr-3 rounded border-primary/20 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
              <label htmlFor="consent" className="text-[10px] text-text-muted leading-normal font-medium select-none">
                I consent to processing of my data per{" "}
                <a href={SITE.legal.privacyPolicyPath} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                  Privacy Policy
                </a>
                {" | "}
                <a href={SITE.legal.termsPath} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                  Terms
                </a>
                . {SITE.legal.consentText}
              </label>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full max-w-xs py-3 px-8 bg-cta-primary hover:bg-cta-primary-hover text-white font-bold text-sm rounded-xl transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-md text-center transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? "Submitting..." : "Enquire now"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
