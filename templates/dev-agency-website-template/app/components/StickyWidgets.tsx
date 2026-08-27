"use client";

import React from "react";
import { Phone, MessageCircle } from "lucide-react";
import { getTelLink, getWhatsAppLink } from "@/constants";

interface StickyWidgetsProps {
  onOpenEnquiry: (projectName?: string) => void;
}

export default function StickyWidgets({ onOpenEnquiry }: StickyWidgetsProps) {
  return (
    <>
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:block">
        <button
          onClick={() => onOpenEnquiry("Enquiry Now")}
          className="bg-primary hover:bg-primary-hover text-white font-extrabold text-[10px] uppercase tracking-widest px-3 py-6 rounded-l-xl shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none [writing-mode:vertical-rl] rotate-180"
          aria-label="Enquire Now"
        >
          Enquire Now
        </button>
      </div>

      <div className="fixed left-6 bottom-6 z-40 hidden md:block">
        <a
          href={getTelLink()}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white hover:bg-primary-hover shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer group relative"
          aria-label="Call Now"
        >
          <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-75" />
          <Phone className="w-6 h-6 z-10 relative" />
        </a>
      </div>

      <div className="fixed right-6 bottom-6 z-40 hidden md:block">
        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-cta-primary text-white hover:bg-cta-primary-hover shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer group relative"
          aria-label="Chat on WhatsApp"
        >
          <span className="absolute inset-0 rounded-full bg-cta-primary/30 animate-ping opacity-75" />
          <svg className="w-7 h-7 fill-white z-10 relative" viewBox="0 0 16 16">
            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
          </svg>
        </a>
      </div>

      <div className="fixed bottom-0 left-0 w-full z-40 flex md:hidden bg-white/95 border-t border-primary/10 backdrop-blur-md shadow-2xl p-2.5 gap-2.5">
        <a
          href={getTelLink()}
          className="flex-1 flex items-center justify-center space-x-2 bg-primary text-white rounded-xl py-3 text-xs font-bold uppercase tracking-wider"
        >
          <Phone className="w-4 h-4" />
          <span>Call Now</span>
        </a>
        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center space-x-2 bg-cta-primary hover:bg-cta-primary-hover text-white rounded-xl py-3 text-xs font-bold uppercase tracking-wider shadow-lg cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>
      </div>
    </>
  );
}
