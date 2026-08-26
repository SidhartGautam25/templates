"use client";

import React, { useState } from "react";
import { projectsData } from "../data/projects";
import { SITE, getTelLink } from "@/constants";

interface DeveloperAboutProps {
  onOpenEnquiry: (projectName?: string) => void;
}

export default function DeveloperAbout({ onOpenEnquiry }: DeveloperAboutProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    project: projectsData[0]?.name || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) return setError("Please enter your name.");
    if (!formData.email.trim()) return setError("Please enter your email.");
    if (!formData.phone.trim() || formData.phone.length < 10) {
      return setError("Please enter a valid 10-digit phone number.");
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: formData.project,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to submit request.");
      }

      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        project: projectsData[0]?.name || "",
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="about-section" className="py-20 px-4 md:px-8 bg-bg-light border-t border-primary/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-bold tracking-widest text-accent-gold-dark uppercase block mb-1">
            {SITE.about.eyebrow}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary">{SITE.about.title}</h2>
          <div className="w-12 h-1 bg-accent-gold rounded-full" />

          <div className="space-y-4 text-sm text-text-main/90 leading-relaxed font-medium">
            {SITE.about.paragraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="pt-4">
            <a
              href={getTelLink()}
              className="inline-flex items-center space-x-3 bg-white border border-accent-gold/30 hover:border-accent-gold rounded-xl px-6 py-4 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-accent-gold/15 flex items-center justify-center text-accent-gold group-hover:bg-primary group-hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <span className="block text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                  {SITE.about.callLabel}
                </span>
                <span className="text-base font-extrabold text-primary tracking-wide">{SITE.contact.phoneDisplay}</span>
              </div>
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 w-full">
          <div className="w-full rounded-2xl shadow-lg bg-white p-6 md:p-8 border border-primary/10 text-text-main">
            <h3 className="text-lg font-bold font-serif text-primary mb-6 border-b border-primary/10 pb-3">
              {SITE.enquiry.formTitle}
            </h3>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center text-center py-10 space-y-4 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-green-600">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-serif text-primary">Request Submitted!</h4>
                <p className="text-[11px] text-text-muted max-w-xs">{SITE.enquiry.aboutSuccessMessage}</p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-4 px-4 py-1.5 rounded-full border border-primary/20 hover:border-accent-gold text-xs transition-colors"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">{error}</div>
                )}

                <div>
                  <select
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    className="w-full bg-bg-tan border border-primary/15 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary text-text-main"
                  >
                    {projectsData.map((proj) => (
                      <option key={proj.id} value={proj.name}>
                        {proj.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-bg-tan border border-primary/15 rounded-lg px-3.5 py-2.5 text-xs placeholder-text-muted/60 focus:outline-none focus:border-primary text-text-main"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-bg-tan border border-primary/15 rounded-lg px-3.5 py-2.5 text-xs placeholder-text-muted/60 focus:outline-none focus:border-primary text-text-main"
                  />
                </div>

                <div>
                  <div className="flex">
                    <span className="inline-flex items-center px-3.5 rounded-l-lg border border-r-0 border-primary/15 bg-bg-light text-xs text-text-muted">
                      +{SITE.contact.countryCode}
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      maxLength={10}
                      placeholder="Enter Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-bg-tan border border-primary/15 rounded-r-lg px-3.5 py-2.5 text-xs placeholder-text-muted/60 focus:outline-none focus:border-primary text-text-main"
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    name="message"
                    rows={2}
                    placeholder="Enter Message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-bg-tan border border-primary/15 rounded-lg px-3.5 py-2.5 text-xs placeholder-text-muted/60 focus:outline-none focus:border-primary text-text-main"
                  />
                </div>

                <div className="flex items-start mt-2">
                  <input
                    type="checkbox"
                    id="about-consent"
                    required
                    defaultChecked
                    className="mt-1 mr-2 rounded text-primary bg-white border-primary/20 focus:ring-primary"
                  />
                  <label htmlFor="about-consent" className="text-[10px] text-text-muted leading-tight">
                    {SITE.legal.shortConsentText}
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-xs tracking-wider transition-all duration-300 flex items-center justify-center shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? "SUBMITTING..." : "SUBMIT NOW"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
