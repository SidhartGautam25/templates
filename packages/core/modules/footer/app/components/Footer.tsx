"use client";

import React, { useEffect, useState } from "react";
import { SITE } from "@/constants";

interface ReraDisplay {
  name: string;
  rera: string;
  reraId?: string | null;
  reraLabel?: string | null;
  reraQrImage?: string | null;
}

interface FooterProps {
  reraItems?: ReraDisplay[] | null;
  /** @deprecated Use reraItems — single listing on detail pages */
  singleProject?: ReraDisplay | null;
}

function ReraQr({ name, qrImage }: { name: string; qrImage?: string | null }) {
  if (qrImage) {
    return (
      <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-primary/10 shadow-sm w-36 h-36 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrImage} alt={`QR code for ${name}`} className="w-28 h-28 object-contain" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-white border border-primary/10 shadow-sm text-primary w-36 h-36">
      <svg className="w-20 h-20 text-primary/60" viewBox="0 0 100 100" fill="currentColor">
        <rect x="0" y="0" width="30" height="30" />
        <rect x="5" y="5" width="20" height="20" fill="white" />
        <rect x="10" y="10" width="10" height="10" />
        <rect x="70" y="0" width="30" height="30" />
        <rect x="75" y="5" width="20" height="20" fill="white" />
        <rect x="80" y="10" width="10" height="10" />
        <rect x="0" y="70" width="30" height="30" />
        <rect x="5" y="75" width="20" height="20" fill="white" />
        <rect x="10" y="80" width="10" height="10" />
        <rect x="70" y="70" width="10" height="10" />
        <rect x="85" y="85" width="15" height="15" />
      </svg>
    </div>
  );
}

export default function Footer({ reraItems, singleProject }: FooterProps) {
  const [loadedItems, setLoadedItems] = useState<ReraDisplay[]>([]);
  const listingsApiPath = SITE.footer.listingsApiPath?.trim();
  const detailItems = reraItems ?? (singleProject ? [singleProject] : null);

  useEffect(() => {
    if (detailItems || !listingsApiPath) return;

    async function loadListings() {
      try {
        const res = await fetch(listingsApiPath);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setLoadedItems(
            json.data.map((item: ReraDisplay) => ({
              name: item.name,
              rera: item.rera,
              reraId: item.reraId,
              reraLabel: item.reraLabel,
              reraQrImage: item.reraQrImage,
            }))
          );
        }
      } catch (error) {
        console.warn("Footer: failed to load listing RERA data", error);
      }
    }

    loadListings();
  }, [detailItems, listingsApiPath]);

  const displayQrs: ReraDisplay[] =
    detailItems && detailItems.length > 0
      ? detailItems
      : loadedItems.length > 0
        ? loadedItems
        : SITE.footer.reraFallbacks;

  return (
    <footer className="bg-footer-bg text-text-main py-16 px-4 md:px-8 border-t border-primary/10">
      <div className="max-w-7xl mx-auto space-y-12">
        {SITE.legal.agentRera && (
          <div className="text-center">
            <span className="text-sm font-bold tracking-widest text-accent-gold-dark uppercase border-b border-accent-gold/20 pb-2 px-4">
              {SITE.footer.reraLabel}: {SITE.legal.agentRera}
            </span>
          </div>
        )}

        {displayQrs.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 pt-4">
            {displayQrs.map((qr, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <ReraQr name={qr.name} qrImage={qr.reraQrImage} />
                <div className="text-center w-full flex flex-col items-center">
                  <span className="block text-[10px] font-bold text-primary truncate max-w-[144px] text-center mx-auto">
                    {qr.reraLabel || qr.name}
                  </span>
                  <span className="text-[9px] font-medium text-text-muted block select-all text-center mx-auto">
                    {qr.reraId || qr.rera}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-[10px] text-text-muted leading-relaxed border-t border-primary/10 pt-8 space-y-3 font-light text-center">
          {SITE.legal.disclaimer.map((paragraph, idx) => (
            <p key={idx} className="max-w-4xl mx-auto">{paragraph}</p>
          ))}
          <p className="text-center pt-4 text-text-main/70 text-[11px] font-medium max-w-4xl mx-auto">
            &copy; {new Date().getFullYear()} {SITE.brand.copyright} {SITE.brand.managedBy}
          </p>
        </div>
      </div>
    </footer>
  );
}
