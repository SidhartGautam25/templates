import { type ReactNode } from "react";
import type { CalloutVariant } from "@/types/content";

const styles: Record<CalloutVariant, string> = {
  info: "border-sky-300/50 bg-sky-500/10 text-[var(--color-doc-text)]",
  warning: "border-amber-300/50 bg-amber-500/10 text-[var(--color-doc-text)]",
  tip: "border-[var(--color-doc-accent)]/40 bg-[var(--color-doc-accent-soft)]/30 text-[var(--color-doc-text)]",
};

export function Callout({
  variant = "info",
  title,
  children,
}: {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className={`my-6 rounded-lg border px-4 py-3 ${styles[variant]}`}>
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
