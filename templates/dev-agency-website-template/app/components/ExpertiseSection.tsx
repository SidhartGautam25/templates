import type { AgencyExpertise } from "@prisma/client";
import {
  Code2,
  Cloud,
  Palette,
  Smartphone,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { SITE } from "@/constants";

const ICONS: Record<string, LucideIcon> = {
  code: Code2,
  palette: Palette,
  cloud: Cloud,
  smartphone: Smartphone,
  layers: Layers,
};

export default function ExpertiseSection({ items }: { items: AgencyExpertise[] }) {
  const section = SITE.agency.expertise;

  return (
    <section id="expertise" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            {section.eyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {section.title}{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              {section.titleAccent}
            </span>
          </h2>
          {section.subtitle && (
            <p className="mt-4 text-slate-400 max-w-2xl leading-relaxed">{section.subtitle}</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => {
            const Icon = ICONS[item.iconKey] ?? Code2;
            return (
              <article
                key={item.id}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 hover:border-violet-500/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-500/15 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-violet-300" />
                </div>
                <h3 className="font-bold text-white text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
