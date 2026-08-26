"use client";

import React, { useState, useEffect } from "react";
import { SITE, getTelLink, getWhatsAppLink } from "@/constants";

export default function Footer() {
  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  
  // Captcha Numbers
  const [num1, setNum1] = useState(3);
  const [num2, setNum2] = useState(1);
  
  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const generateCaptcha = () => {
    setNum1(Math.floor(Math.random() * 9) + 1);
    setNum2(Math.floor(Math.random() * 9) + 1);
    setCaptchaInput("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!firstName.trim() || !lastName.trim()) {
      return setError("First name and Last name are required.");
    }
    if (!email.trim() || !phone.trim() || !message.trim()) {
      return setError("All fields (Email, Telephone, Message) are required.");
    }

    const expectedAnswer = num1 + num2;
    if (parseInt(captchaInput, 10) !== expectedAnswer) {
      return setError("Incorrect Captcha. Please solve the simple math problem.");
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName.trim()} ${lastName.trim()}`,
          email: email.trim(),
          phone: phone.trim(),
          projectName: "General Enquiry",
          message: message.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to submit enquiry.");
      }

      setSuccess(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setMessage("");
      generateCaptcha();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-bg-tan text-text-main py-20 px-6 md:px-12 lg:px-24 border-t border-primary/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Contact details */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <span className="text-[10px] font-extrabold tracking-[0.25em] text-accent-gold-dark uppercase block font-sans">
              Hotel & Resort
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-serif tracking-tight text-primary leading-tight">
              {SITE.brand.name}
            </h2>

            {/* Address */}
            <div className="space-y-2.5 pt-4">
              <span className="block text-[10px] font-bold text-accent-gold-dark uppercase tracking-widest font-sans">
                Address
              </span>
              <p className="text-xs text-text-muted leading-relaxed font-sans max-w-sm">
                KHATA No.- 2, KHESARA No.- 6, BHAG VARTMAN- 6, Sadar Hospital, Anchal Sadar Dhansir, Gaya, Bihar
              </p>
            </div>

            {/* Bookings */}
            <div className="space-y-2.5 pt-2">
              <span className="block text-[10px] font-bold text-accent-gold-dark uppercase tracking-widest font-sans">
                Bookings
              </span>
              <a
                href={getTelLink()}
                className="flex items-center gap-2 text-sm font-serif text-primary hover:text-accent-gold transition-colors"
              >
                <svg className="w-4 h-4 text-accent-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>{SITE.contact.phoneDisplay}</span>
              </a>
            </div>

            {/* Questions */}
            <div className="space-y-2.5 pt-2">
              <span className="block text-[10px] font-bold text-accent-gold-dark uppercase tracking-widest font-sans">
                Questions
              </span>
              <a
                href={`mailto:${SITE.contact.email}`}
                className="flex items-center gap-2 text-sm font-serif text-primary hover:text-accent-gold transition-colors"
              >
                <svg className="w-4 h-4 text-accent-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>{SITE.contact.email}</span>
              </a>
            </div>
          </div>

          {/* Socials */}
          <div className="flex items-center space-x-4 pt-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-white border border-primary/10 text-text-muted hover:text-primary hover:border-primary/20 shadow-sm transition-all hover:scale-105"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-white border border-primary/10 text-text-muted hover:text-primary hover:border-primary/20 shadow-sm transition-all hover:scale-105"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-white border border-primary/10 text-text-muted hover:text-primary hover:border-primary/20 shadow-sm transition-all hover:scale-105"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Right Column: Contact form */}
        <div className="lg:col-span-7 bg-bg-light/50 border border-primary/5 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="bg-bg-card border border-black/[0.04] rounded-2xl p-6 space-y-6">
            <div className="border-b border-black/[0.04] pb-4">
              <span className="block text-[10px] font-bold text-accent-gold-dark uppercase tracking-widest font-sans mb-1">
                Get In Touch
              </span>
              <h3 className="text-xl font-bold font-serif text-primary">Contact Us</h3>
            </div>

            {error && (
              <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl font-bold">
                Thank you! Your message has been sent successfully. Our team will contact you shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-bg-light/60 border border-black/[0.06] rounded-xl px-4 py-3 text-xs text-primary focus:outline-none focus:border-accent-gold font-sans"
                />
                {/* Last Name */}
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-bg-light/60 border border-black/[0.06] rounded-xl px-4 py-3 text-xs text-primary focus:outline-none focus:border-accent-gold font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-bg-light/60 border border-black/[0.06] rounded-xl px-4 py-3 text-xs text-primary focus:outline-none focus:border-accent-gold font-sans"
                />
                {/* Telephone */}
                <input
                  type="tel"
                  placeholder="Telephone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-bg-light/60 border border-black/[0.06] rounded-xl px-4 py-3 text-xs text-primary focus:outline-none focus:border-accent-gold font-sans"
                />
              </div>

              {/* Message */}
              <textarea
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full bg-bg-light/60 border border-black/[0.06] rounded-xl px-4 py-3 text-xs text-primary focus:outline-none focus:border-accent-gold font-sans resize-none"
              />

              {/* Captcha & Submit */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-black/[0.04] mt-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-text-muted font-sans whitespace-nowrap">
                    Are you human?
                  </span>
                  <div className="bg-bg-light/60 px-3.5 py-2 rounded-xl text-xs font-bold text-primary border border-black/[0.06] font-mono select-none">
                    {num1} + {num2} = ?
                  </div>
                  <input
                    type="text"
                    placeholder="Result"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    className="w-16 bg-bg-light/60 border border-black/[0.06] rounded-xl px-2 py-2 text-center text-xs text-primary focus:outline-none focus:border-accent-gold font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold uppercase tracking-widest rounded-xl shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto border-t border-primary/10 pt-8 mt-12 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-text-muted font-light">
        <p className="max-w-xl text-center md:text-left leading-relaxed">
          Disclaimer: The information provided on this website is for informational purposes only. Images, amenities, and availability are subject to change. Please contact our reservations team for the latest details and confirmed pricing.
        </p>
        <p className="text-center md:text-right font-medium text-text-main/80 whitespace-nowrap">
          &copy; {new Date().getFullYear()} {SITE.brand.copyright} {SITE.brand.managedBy}
        </p>
      </div>
    </footer>
  );
}
