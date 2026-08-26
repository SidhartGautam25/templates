import { type ReactNode } from "react";
import type { CalloutVariant } from "@/types/content";

const styles: Record<CalloutVariant, string> = {
  info: "border-sky-200 bg-sky-50 text-sky-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  tip: "border-teal-200 bg-teal-50 text-teal-900",
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
