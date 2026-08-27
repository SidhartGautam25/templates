"use client";

import React, { useState } from "react";
import { SITE } from "@/constants";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, User, Key, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      return setError("Please enter both username and password.");
    }

    setIsSubmitting(true);

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid username or password. Please try again.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-tan/60 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-black/[0.06] rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Portal Padlock */}
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        
        {/* Branding header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-widest text-accent-gold-dark uppercase block">
            Security Gateway
          </span>
          <h2 className="text-2xl font-bold font-serif text-primary">
            {SITE.admin.portalTitle}
          </h2>
          <p className="text-xs text-text-muted">
            {SITE.admin.portalSubtitle}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Username Input */}
          <div className="space-y-1">
            <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold ml-1">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-muted pointer-events-none">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-bg-tan/40 border border-black/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold ml-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-muted pointer-events-none">
                <Key className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-tan/40 border border-black/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent-gold"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/95 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-xs tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>VERIFYING...</span>
              </>
            ) : (
              <span>SIGN IN TO WORKSPACE</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
